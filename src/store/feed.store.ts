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
  homeState: string | null;
  religion: string | null;
  gender: string | null;
  campusInvolvement: string | null; // e.g., Rushing fraternity/sorority, business fraternity
  other: string | null; // e.g., Looking for roommate, Student Athlete
  // Lifestyle filters
  sleepSchedule: string | null; // Early Bird, Night Owl, Flexible
  cleanliness: string | null; // Neat Freak, Organized, Casual, Messy
  guests: string | null; // Over Whenever, With Notice, Rarely
  studying: string | null; // Around Campus, In Room, Library, Flexible
  personality: string[] | null; // Array of personality traits
  physicalActivity: string[] | null; // Array of physical activities
  pastimes: string[] | null; // Array of pastimes
  food: string[] | null; // Array of food preferences
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
  isInitialLoad: boolean; // Track if this is the first load to prevent initial modal
  
  // Selected college info
  selectedCollegeId: string | null;
  selectedCollegeName: string | null;
  
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
  setCollegeWithName: (collegeId: string | null, collegeName: string | null) => void;
  setCollegeFromHero: (collegeId: string | null, collegeName?: string | null) => void;
  setSubstances: (substances: string | null) => void;
  setHomeState: (homeState: string | null) => void;
  setReligion: (religion: string | null) => void;
  setGender: (gender: string | null) => void;
  setCampusInvolvement: (status: string | null) => void;
  setOther: (other: string | null) => void;
  // Lifestyle filter setters
  setSleepSchedule: (schedule: string | null) => void;
  setCleanliness: (level: string | null) => void;
  setGuests: (preference: string | null) => void;
  setStudying: (preference: string | null) => void;
  setPersonality: (traits: string[] | null) => void;
  setPhysicalActivity: (activities: string[] | null) => void;
  setPastimes: (pastimes: string[] | null) => void;
  setFood: (preferences: string[] | null) => void;
  refreshFeed: () => void;
  markModalDismissed: () => void; // Action to mark modal as dismissed
  checkFilterAccess: () => boolean; // Check if user can access filters
}

const initialFilters: FeedFilters = {
  searchQuery: '',
  lastDays: 30, // Default to last 30 days
  college: null,
  substances: null,
  homeState: null,
  religion: null,
  gender: null,
  campusInvolvement: null,
  other: null,
  // Initialize new lifestyle filters
  sleepSchedule: null,
  cleanliness: null,
  guests: null,
  studying: null,
  personality: null,
  physicalActivity: null,
  pastimes: null,
  food: null,
};

// This function will be called whenever the filters change
const handleFilterChange = async (get: () => FeedState, set: (state: Partial<FeedState>) => void) => {
 
  set({ 
    isLoading: true, 
    error: null, 
    posts: [], 
    currentPage: 0, 
    hasMore: true,
    hasReachedLimit: false,
    modalShownAndDismissed: false,
  });
  
  try {
    const response = await feedService.fetchPosts({
      ...get().filters,
      page: 1,
      limit: get().postsPerPage,
    });
    
    if (response.status) {
      const { posts, totalDocs, page, totalPages, hasNextPage } = response.data;
      
      const postLimit = getPostLimit();
      let finalPosts = posts;
      let reachedLimit = false;
      
      if (postLimit !== null && posts.length >= postLimit) {
        finalPosts = posts.slice(0, postLimit);
        reachedLimit = true;
      }
      
      set({
        posts: finalPosts,
        totalCount: totalDocs,
        currentPage: page,
        totalPages,
        hasMore: hasNextPage && !reachedLimit,
        hasReachedLimit: reachedLimit,
        modalType: reachedLimit ? getModalType() : null,
        isLoading: false,
      });
    } else {
      throw new Error(response.message || 'Failed to fetch posts with new filters');
    }
  } catch (error) {
    console.error("Feed: Error applying filters:", error);
    set({ 
      isLoading: false, 
      error: (error as Error).message 
    });
  }
};

// Helper function to determine post limit for user
const getPostLimit = (): number | null => {
  const { user } = useAuthStore.getState();
  
  console.log('Feed: getPostLimit called with user:', {
    hasUser: !!user,
    isSubscribed: user?.isSubscribed,
    isProfileCompleted: user?.isProfileCompleted,
    email: user?.email
  });
  
  // Premium users get unlimited posts
  if (user?.isSubscribed) {
 
    return null; // Unlimited
  }
  
  // Authenticated users with completed profile get 10 posts
  if (user && user.isProfileCompleted) {
 
    return 10; // Non-premium users with completed profile get 10 posts
  }
  
  // Authenticated users without completed profile get 6 posts (same as unauthenticated)
  if (user && !user.isProfileCompleted) {
 
    return 6;
  }
  
  // Unauthenticated users get 6 posts
 
  return 6;
};

// Helper function to determine modal type
const getModalType = (): 'signup' | 'premium' | null => {
  const { user } = useAuthStore.getState();
  
  console.log('Feed: getModalType called with user:', {
    hasUser: !!user,
    isSubscribed: user?.isSubscribed,
    isProfileCompleted: user?.isProfileCompleted,
    email: user?.email
  });
  
  // No user - show signup modal
  if (!user) {
 
    return 'signup';
  }
  
  // User exists but profile not completed - show signup modal (to complete profile)
  if (user && !user.isProfileCompleted) {
 
    return 'signup';
  }
  
  // User exists, profile completed, but not subscribed - show premium modal
  if (user && user.isProfileCompleted && !user.isSubscribed) {
 
    return 'premium';
  }
  
  // Premium users don't need any modal
 
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
  maxPostsForUnauthenticated: 7, // Allow only 10 posts for unauthenticated users
  maxPostsForNonPremium: 20, // Allow 10 posts for non-premium users with completed profile
  hasReachedLimit: false,
  modalShownAndDismissed: false,
  modalType: null,
  isInitialLoad: true, // Start as initial load
  selectedCollegeId: null,
  selectedCollegeName: null,
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
 
        return;
      }
      
      // If we already have posts, don't reinitialize
      if (currentState.posts.length > 0) {
 
        return;
      }
      
 
    set({ 
      isLoading: true, 
      error: null, 
      posts: [], 
      currentPage: 0, 
      hasMore: true, 
      hasReachedLimit: false,
      modalShownAndDismissed: false, // Reset modal state on initialization
      modalType: null,
      isInitialLoad: true // Reset to initial load when initializing
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
        
        // On initial load, don't trigger the limit modal even if we have exactly the limit
        // Only trigger it if we have MORE than the limit
        const isInitial = get().isInitialLoad;
        
        if (postLimit !== null && posts.length > postLimit) {
          finalPosts = posts.slice(0, postLimit);
          reachedLimit = true;
        } else if (postLimit !== null && posts.length >= postLimit && !isInitial) {
          // Only set reachedLimit if not initial load and we have exactly the limit
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
          modalType: isInitial ? null : modalType, // Don't show modal on initial load
          isInitialLoad: false, // Set to false after the first successful load
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
        
        // For loadMorePosts, always check limits normally since this is not initial load
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
  applyFilters: () => handleFilterChange(get, set),
  
  // Update a specific filter and reload
  updateFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
  },
  
  // Reset filters to initial state and reload
  resetFilters: () => {
    set({ filters: initialFilters });
  },
  
  // Search posts
  searchPosts: (query) => {
    get().updateFilter('searchQuery', query);
  },
  
  // Set date range filter
  setDateRange: (lastDays) => {
    get().updateFilter('lastDays', lastDays);
  },
  
  // Set college filter
  setCollege: (college) => {
    get().updateFilter('college', college);
  },

  // Set college with both ID and name
  setCollegeWithName: (collegeId, collegeName) => {
    set((state) => ({
      filters: { ...state.filters, college: collegeId },
      selectedCollegeId: collegeId,
      selectedCollegeName: collegeName,
    }));
  },

  // Set college filter without permission check (for auto-filtering from hero)
  setCollegeFromHero: (collegeId, collegeName) => {
    set((state) => ({
      filters: { ...state.filters, college: collegeId },
      selectedCollegeId: collegeId,
      selectedCollegeName: collegeName || null,
    }));
  },
  
  // Set substances filter
  setSubstances: (substances) => {
    get().updateFilter('substances', substances);
  },
  
  // Set Home State
  setHomeState: (homeState) => {
    get().updateFilter('homeState', homeState);
  },

  // Set Religion
  setReligion: (religion) => {
    get().updateFilter('religion', religion);
  },

  // Set Gender
  setGender: (gender) => {
    get().updateFilter('gender', gender);
  },

  // Set Campus Involvement
  setCampusInvolvement: (status) => {
    get().updateFilter('campusInvolvement', status);
  },

  // Set Other
  setOther: (other) => {
    get().updateFilter('other', other);
  },
  
  // Lifestyle filter setters
  setSleepSchedule: (schedule) => {
    get().updateFilter('sleepSchedule', schedule);
  },

  setCleanliness: (level) => {
    get().updateFilter('cleanliness', level);
  },

  setGuests: (preference) => {
    get().updateFilter('guests', preference);
  },

  setStudying: (preference) => {
    get().updateFilter('studying', preference);
  },

  setPersonality: (traits) => {
    get().updateFilter('personality', traits);
  },

  setPhysicalActivity: (activities) => {
    get().updateFilter('physicalActivity', activities);
  },

  setPastimes: (pastimes) => {
    get().updateFilter('pastimes', pastimes);
  },

  setFood: (preferences) => {
    get().updateFilter('food', preferences);
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
      modalType: null,
      isInitialLoad: true // Reset to initial load when refreshing
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
        
        // On refresh (which is like initial load), don't trigger the limit modal 
        // even if we have exactly the limit - only trigger it if we have MORE than the limit
        const isInitial = get().isInitialLoad;
        
        if (postLimit !== null && posts.length > postLimit) {
          finalPosts = posts.slice(0, postLimit);
          reachedLimit = true;
        } else if (postLimit !== null && posts.length >= postLimit && !isInitial) {
          // Only set reachedLimit if not initial load and we have exactly the limit
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
          isInitialLoad: false, // Mark as no longer initial load
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

// Create a subscription to the filters state
useFeedStore.subscribe(
  (state) => state.filters,
  (newFilters, oldFilters) => {
    // We only want to refetch if the filters have actually changed.
    // This deep comparison is simple but effective for this object structure.
    if (JSON.stringify(newFilters) !== JSON.stringify(oldFilters)) {
      useFeedStore.getState().applyFilters();
    }
  }
); 