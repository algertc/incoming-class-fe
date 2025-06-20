import type { Post } from '../features/feed/components/PostCard';
import { API_CONFIG } from '../config/api.config';
import { request } from '../hooks/api/http.client';
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
  totalDocs: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number;
  prevPage: number | null;
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
    posts:ApiPost[];
    totalDocs: number;
    limit:  number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number;
    prevPage: number | null;
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
    if (params.college && params.college !== 'all') queryParams.college = params.college;

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

      const response = await request<GetAllPostsApiResponse>({
        method: 'GET',
        url: API_CONFIG.ENDPOINTS.GET_ALL_POSTS,
        params: queryParams,
      });

      if (!response.status) {
        throw new Error(response.message || 'Failed to fetch posts');
      }

      console.log("response  : ", response);


      const transformedPosts = response.data.posts.map(this.transformApiPost);

      return {
          data: {
            posts: transformedPosts,
            limit: response.data.limit,
            totalDocs: response.data.totalDocs,
            page: response.data.page,
            totalPages: response.data.totalPages,
            hasNextPage: response.data.hasNextPage,
            hasPrevPage: response.data.hasPrevPage,
            nextPage: response.data.nextPage,
            prevPage: response.data.prevPage
          },
        status: true,
        message: response.message || `Successfully fetched ${transformedPosts.length} posts`
      };

    } catch (error) {
      console.error('Feed Service Error:', error);
      return {
        data: {
          posts: [],
          totalDocs: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
          nextPage: 1,
          prevPage: null
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