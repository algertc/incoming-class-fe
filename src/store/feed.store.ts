import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Post } from '../features/feed/components/PostCard';
import { feedService } from '../services/feed.service';
import { useAuthStore } from './auth.store';

export interface FeedFilters {
  searchQuery: string;
  lastDays: number; // Number of days to look back from today
  college: string | null;
  substances: string | null;
  personality: string[] | null;
  hometown: string | null;
}

export interface FeedState {
  // Posts data
  posts: Post[]; // All accumulated posts for infinite scroll
  
  // Loading states
  isLoading: boolean;
  isLoadingMore: boolean;
  
  // Error state
  error: string | null;
  
  // Pagination (handled by backend)
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasMore: boolean;
  postsPerPage: number; // Backend returns 5 per page
  
  // User access limits
  maxPostsForUnauthenticated: number;
  maxPostsForNonPremium: number;
  hasReachedLimit: boolean;
  modalShownAndDismissed: boolean; // Track if modal was shown and user dismissed it
  modalType: 'signup' | 'premium' | null; // Type of modal to show
  
  // Filters
  filters: FeedFilters;
  
  // Actions
  initializeFeed: () => void;
  loadMorePosts: () => void;
  applyFilters: () => void;
  updateFilter: <K extends keyof FeedFilters>(key: K, value: FeedFilters[K]) => void;
  resetFilters: () => void;
  searchPosts: (query: string) => void;
  setDateRange: (lastDays: number) => void;
  setCollege: (college: string | null) => void;
  setSubstances: (substances: string | null) => void;
  setPersonality: (personality: string[] | null) => void;
  setHometown: (hometown: string | null) => void;
  refreshFeed: () => void;
  markModalDismissed: () => void; // Action to mark modal as dismissed
  checkFilterAccess: () => boolean; // Check if user can access filters
}

const initialFilters: FeedFilters = {
  searchQuery: '',
  lastDays: 30, // Default to last 30 days
  college: null,
  substances: null,
  personality: null,
  hometown: null,
};

// Helper function to determine post limit for user
const getPostLimit = (): number | null => {
  const { user } = useAuthStore.getState();
  
  if (user?.isSubscribed) {
    return null; // Unlimited
  }
  if (user && user.isProfileCompleted) {
    return 10; // Non-premium users with completed profile get 10 posts
  }
  return 6; // Unauthenticated users get 6 posts
};

// Helper function to determine modal type
const getModalType = (): 'signup' | 'premium' | null => {
  const { user } = useAuthStore.getState();
  
  if (!user) {
    return 'signup';
  }
  if (user && user.isProfileCompleted && !user.isSubscribed) {
    return 'premium';
  }
  return null;
};

export const useFeedStore = create<FeedState>()(
  subscribeWithSelector((set, get) => ({
  // Initial state
  posts: [],
  isLoading: false,
  isLoadingMore: false,
  error: null,
  currentPage: 0,
  totalPages: 0,
  totalCount: 0,
  hasMore: true,
  postsPerPage: 5, // Backend returns 5 posts per page
  maxPostsForUnauthenticated: 6, // Allow only 6 posts for unauthenticated users
  maxPostsForNonPremium: 10, // Allow 10 posts for non-premium users with completed profile
  hasReachedLimit: false,
  modalShownAndDismissed: false,
  modalType: null,
  filters: initialFilters,
  
  // Check if user can access filters (only premium users)
  checkFilterAccess: () => {
    const { user } = useAuthStore.getState();
    return !!user?.isSubscribed;
  },
  
  // Initialize feed - load first page
  initializeFeed: async () => {
      const currentState = get();
      
      console.log('Feed: initializeFeed called, current state:', {
        isLoading: currentState.isLoading,
        postsLength: currentState.posts.length,
        error: currentState.error
      });
      
      // Prevent multiple simultaneous initializations
      if (currentState.isLoading) {
        console.log('Feed: Already loading, skipping initialization');
        return;
      }
      
      // If we already have posts, don't reinitialize
      if (currentState.posts.length > 0) {
        console.log('Feed: Already have posts, skipping initialization');
        return;
      }
      
    console.log('Feed: Starting initialization');
    set({ 
      isLoading: true, 
      error: null, 
      posts: [], 
      currentPage: 0, 
      hasMore: true, 
      hasReachedLimit: false,
      modalShownAndDismissed: false, // Reset modal state on initialization
      modalType: null
    });
    
    try {
      console.log('Feed: Making API call');
      
      const response = await feedService.fetchPosts({
        ...get().filters,
        page: 1,
        limit: get().postsPerPage,
      });
      
      console.log('Feed: API response received:', response);
      
      if (response.status) {
        const { posts, totalDocs, page, totalPages, hasNextPage } = response.data;
        
        // Apply post limits based on user context
        const postLimit = getPostLimit();
        let finalPosts = posts;
        let reachedLimit = false;
        
        if (postLimit !== null && posts.length > postLimit) {
          finalPosts = posts.slice(0, postLimit);
          reachedLimit = true;
        } else if (postLimit !== null && posts.length >= postLimit) {
          reachedLimit = true;
        }
        
        const modalType = reachedLimit ? getModalType() : null;
        
        console.log('Feed: Setting posts:', finalPosts.length, 'reachedLimit:', reachedLimit);
        
        set({
          posts: finalPosts,
          totalCount: totalDocs,
          currentPage: page,
          totalPages,
          hasMore: hasNextPage && !reachedLimit,
          hasReachedLimit: reachedLimit,
          modalType,
          isLoading: false,
          error: null,
        });
      } else {
        console.error('Feed: API returned error:', response.error);
        set({
          error: response.error || 'Failed to load posts',
          isLoading: false,
          posts: [],
        });
      }
    } catch (error) {
      console.error('Feed: Exception during initialization:', error);
      set({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        isLoading: false,
        posts: [],
      });
    }
  },
  
  // Load more posts for infinite scroll
  loadMorePosts: async () => {
    const state = get();
      
    // Prevent loading more if user has reached limit and modal was dismissed
    if (state.modalShownAndDismissed && state.hasReachedLimit) {
      return;
    }
    
    if (!state.hasMore || state.isLoadingMore || state.isLoading || state.hasReachedLimit) {
      return;
    }
    
    set({ isLoadingMore: true, error: null });
    
    try {
      const nextPage = state.currentPage + 1;
      const response = await feedService.fetchPosts({
        ...state.filters,
        page: nextPage,
        limit: state.postsPerPage,
      });
      
      if (response.status) {
        const { posts: newPosts, totalDocs, page, totalPages, hasNextPage } = response.data;
        
        // Accumulate posts for infinite scroll
        const allPosts = [...state.posts, ...newPosts];
        
        // Apply post limits based on user context
        const postLimit = getPostLimit();
        let finalPosts = allPosts;
        let reachedLimit = false;
        
        if (postLimit !== null && allPosts.length > postLimit) {
          finalPosts = allPosts.slice(0, postLimit);
          reachedLimit = true;
        } else if (postLimit !== null && allPosts.length >= postLimit) {
          reachedLimit = true;
        }
        
        const modalType = reachedLimit ? getModalType() : null;
        
        set({
          posts: finalPosts,
          totalCount: totalDocs,
          currentPage: page,
          totalPages,
          hasMore: hasNextPage && !reachedLimit,
          hasReachedLimit: reachedLimit,
          modalType,
          isLoadingMore: false,
          error: null,
        });
      } else {
        set({
          error: response.error || 'Failed to load more posts',
          isLoadingMore: false,
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        isLoadingMore: false,
      });
    }
  },
  
  // Apply filters - reset and reload from page 1
  applyFilters: async () => {
    // Check if user has access to filters
    if (!get().checkFilterAccess()) {
      return;
    }
    
    set({ 
      isLoading: true, 
      error: null, 
      posts: [], 
      currentPage: 0, 
      hasMore: true, 
      hasReachedLimit: false,
      modalShownAndDismissed: false, // Reset modal state when applying filters
      modalType: null
    });
    
    try {
      const response = await feedService.fetchPosts({
        ...get().filters,
        page: 1,
        limit: get().postsPerPage,
      });
      
      if (response.status) {
        const { posts, totalDocs, page, totalPages, hasNextPage } = response.data;
        
        // Apply post limits based on user context
        const postLimit = getPostLimit();
        let finalPosts = posts;
        let reachedLimit = false;
        
        if (postLimit !== null && posts.length > postLimit) {
          finalPosts = posts.slice(0, postLimit);
          reachedLimit = true;
        } else if (postLimit !== null && posts.length >= postLimit) {
          reachedLimit = true;
        }
        
        const modalType = reachedLimit ? getModalType() : null;
        
        set({
          posts: finalPosts,
          totalCount: totalDocs,
          currentPage: page,
          totalPages,
          hasMore: hasNextPage && !reachedLimit,
          hasReachedLimit: reachedLimit,
          modalType,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          error: response.error || 'Failed to apply filters',
          isLoading: false,
          posts: [],
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        isLoading: false,
        posts: [],
      });
    }
  },
  
  // Update a specific filter and reload
  updateFilter: (key, value) => {
    // Check if user has access to filters
    if (!get().checkFilterAccess()) {
      return;
    }
    
    set(state => ({
      filters: { ...state.filters, [key]: value }
    }));
    get().applyFilters();
  },
  
  // Reset filters to initial state and reload
  resetFilters: () => {
    // Check if user has access to filters
    if (!get().checkFilterAccess()) {
      return;
    }
    
    set({ filters: initialFilters });
    get().applyFilters();
  },
  
  // Search posts
  searchPosts: (query) => {
    // Check if user has access to filters
    if (!get().checkFilterAccess()) {
      return;
    }
    
    get().updateFilter('searchQuery', query);
  },
  
  // Set date range filter
  setDateRange: (lastDays) => {
    // Check if user has access to filters
    if (!get().checkFilterAccess()) {
      return;
    }
    
    get().updateFilter('lastDays', lastDays);
  },
  
  // Set college filter
  setCollege: (college) => {
    // Check if user has access to filters
    if (!get().checkFilterAccess()) {
      return;
    }
    
    get().updateFilter('college', college);
  },
  
  // Set substances filter
  setSubstances: (substances) => {
    // Check if user has access to filters
    if (!get().checkFilterAccess()) {
      return;
    }
    
    get().updateFilter('substances', substances);
  },
  
  // Set personality filter
  setPersonality: (personality) => {
    // Check if user has access to filters
    if (!get().checkFilterAccess()) {
      return;
    }
    
    get().updateFilter('personality', personality);
  },
  
  // Set hometown filter
  setHometown: (hometown) => {
    // Check if user has access to filters
    if (!get().checkFilterAccess()) {
      return;
    }
    
    get().updateFilter('hometown', hometown);
  },
  
  // Refresh feed - reload from page 1
  refreshFeed: async () => {
    set({ 
      isLoading: true, 
      error: null, 
      posts: [], 
      currentPage: 0, 
      hasMore: true, 
      hasReachedLimit: false,
      modalShownAndDismissed: false, // Reset modal state when refreshing
      modalType: null
    });
    
    try {
      const response = await feedService.fetchPosts({
        ...get().filters,
        page: 1,
        limit: get().postsPerPage,
      });
      
      if (response.status) {
        const { posts, totalDocs, page, totalPages, hasNextPage } = response.data;
        
        // Apply post limits based on user context
        const postLimit = getPostLimit();
        let finalPosts = posts;
        let reachedLimit = false;
        
        if (postLimit !== null && posts.length > postLimit) {
          finalPosts = posts.slice(0, postLimit);
          reachedLimit = true;
        } else if (postLimit !== null && posts.length >= postLimit) {
          reachedLimit = true;
        }
        
        const modalType = reachedLimit ? getModalType() : null;
        
        set({
          posts: finalPosts,
          totalCount: totalDocs,
          currentPage: page,
          totalPages,
          hasMore: hasNextPage && !reachedLimit,
          hasReachedLimit: reachedLimit,
          modalType,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          error: response.error || 'Failed to refresh feed',
          isLoading: false,
          posts: [],
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        isLoading: false,
        posts: [],
      });
    }
  },
    
  // Mark modal as dismissed
  markModalDismissed: () => {
    set({ modalShownAndDismissed: true });
  },
  }))
); 