import type { Post } from '../features/feed/components/PostCard';
import { API_CONFIG } from '../config/api.config';
import { request } from '../hooks/api/http.client';
import type { IServerResponse } from '../models/serverResponse.model';

export interface FetchPostsParams {
  page?: number;
  limit?: number;
  searchQuery?: string;
  categories?: string[];
  sortBy?: 'newest' | 'popular' | 'comments';
  lastDays?: number; // Number of days to look back from today
  college?: string | null;
}

export interface FetchPostsResponse {
  posts: Post[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  data: T;
  status: boolean;
  message?: string;
  error?: string;
}

// API Response types - simplified to match backend response
interface ApiPost {
  _id: string;
  content: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
    verified?: boolean;
  };
  images?: string[];
  createdAt: string;
  updatedAt: string;
  likes?: string[];
  comments?: Array<{ _id: string; content: string; author: string; createdAt: string }>;
  college?: string;
  categories?: string[];
}

interface GetAllPostsApiResponse {
  data: ApiPost[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasMore: boolean;
  };
}

class FeedService {
  // Convert API post to frontend Post interface
  private transformApiPost(apiPost: ApiPost): Post {
    return {
      id: apiPost._id,
      content: apiPost.content,
      author: {
        id: apiPost.author._id,
        name: `${apiPost.author.firstName} ${apiPost.author.lastName}`,
        avatar: apiPost.author.profileImage || '',
        verified: apiPost.author.verified || false,
      },
      timestamp: new Date(apiPost.createdAt),
      images: apiPost.images,
      likes: apiPost.likes?.length || 0,
      comments: apiPost.comments?.length || 0,
      shares: 0,
      isLiked: false,
    };
  }

  // Build query parameters - let backend handle all logic
  private buildQueryParams(params: FetchPostsParams): Record<string, string | string[]> {
    const queryParams: Record<string, string | string[]> = {};

    if (params.page) queryParams.page = params.page.toString();
    if (params.limit) queryParams.limit = params.limit.toString();
    if (params.searchQuery) queryParams.search = params.searchQuery;
    if (params.sortBy) queryParams.sortBy = params.sortBy;
    if (params.college && params.college !== 'all') queryParams.college = params.college;

    // Handle categories array
    if (params.categories && params.categories.length > 0) {
      queryParams.categories = params.categories;
    }

    // Handle last days filter
    if (params.lastDays) {
      queryParams.lastDays = params.lastDays.toString();
    }

    return queryParams;
  }

  // Fetch posts - backend handles all filtering, pagination, sorting
  async fetchPosts(params: FetchPostsParams = {}): Promise<ApiResponse<FetchPostsResponse>> {
    try {
      const queryParams = this.buildQueryParams(params);

      const response: IServerResponse<GetAllPostsApiResponse> = await request({
        method: 'GET',
        url: API_CONFIG.ENDPOINTS.GET_ALL_POSTS,
        params: queryParams,
      });

      if (!response.status) {
        throw new Error(response.message || 'Failed to fetch posts');
      }

      console.log("response  : ", response);


      const transformedPosts = response.data.data.map(this.transformApiPost);

      // Use pagination info from backend if available, otherwise create basic response
      const pagination = response.data.pagination || {
        currentPage: params.page || 1,
        totalPages: 1,
        totalCount: transformedPosts.length,
        hasMore: false
      };

      return {
        data: {
          posts: transformedPosts,
          totalCount: pagination.totalCount,
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          hasMore: pagination.hasMore
        },
        status: true,
        message: response.message || `Successfully fetched ${transformedPosts.length} posts`
      };

    } catch (error) {
      console.error('Feed Service Error:', error);
      return {
        data: {
          posts: [],
          totalCount: 0,
          currentPage: 1,
          totalPages: 0,
          hasMore: false
        },
        status: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to fetch posts'
      };
    }
  }

  // Fetch all posts (same as fetchPosts since backend handles everything)
  async fetchAllPosts(params: Omit<FetchPostsParams, 'page' | 'limit'> = {}): Promise<ApiResponse<Post[]>> {
    try {
      const response = await this.fetchPosts(params);

      if (response.status) {
        return {
          data: response.data.posts,
          status: true,
          message: response.message
        };
      } else {
        return {
          data: [],
          status: false,
          error: response.error,
          message: response.message
        };
      }
    } catch (error) {
      console.error('Feed Service Error:', error);
      return {
        data: [],
        status: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to fetch posts'
      };
    }
  }

  // Refresh feed
  async refreshFeed(params: FetchPostsParams = {}): Promise<ApiResponse<FetchPostsResponse>> {
    return await this.fetchPosts(params);
  }

  // Get trending topics
  async getTrendingTopics(): Promise<ApiResponse<{ tag: string; posts: string }[]>> {
    try {
      // This would be a separate endpoint in a real backend
      const trendingTopics = [
        { tag: "#IncomingClass", posts: "2.5k" },
        { tag: "#CollegeLife", posts: "1.8k" },
        { tag: "#Roommates", posts: "950" },
        { tag: "#CampusTips", posts: "720" },
        { tag: "#StudyGroup", posts: "640" },
        { tag: "#CampusEvents", posts: "520" }
      ];

      return {
        data: trendingTopics,
        status: true,
        message: 'Successfully fetched trending topics'
      };
    } catch (error) {
      return {
        data: [],
        status: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to fetch trending topics'
      };
    }
  }
}

// Export singleton instance
export const feedService = new FeedService();

export default feedService; 