import type { Post } from '../features/feed/components/PostCard';
// import { API_CONFIG } from '../config/api.config';  
import { request } from '../hooks/api/http.client';
import API_ENDPOINTS from '../hooks/api/api.endpoints';

export interface FetchPostsParams {
  page?: number;
  limit?: number;
  searchQuery?: string;
  lastDays?: number; // Number of days to look back from today
  college?: string | null;
  substances?: string | null;
  hometown?: string | null;
  religion?: string | null;
  gender?: string | null;
  campusInvolvement?: string | null;
  other?: string | null;
  // Lifestyle filters
  sleepSchedule?: string | null;
  cleanliness?: string | null;
  guests?: string | null;
  studying?: string | null;
  personality?: string[] | null;
  physicalActivity?: string[] | null;
  pastimes?: string[] | null;
  food?: string[] | null;
}

export interface FetchPostsResponse {
  posts: Post[];
  totalDocs: number;
  page: number;
  limit: number;
  totalPages: number;
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
  title?: string;
  content: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
    verified?: boolean;
  };
  images?: string[];
  videos?: string[];
  createdAt: string;
  updatedAt: string;
  likes?: string[];
  likedBy?: string[];
  likesCount?: number;
  comments?: Array<{ _id: string; content: string; author: string; createdAt: string }>;
  college?: {
    _id: string;
    name: string;
  };
  tags?: string[];
  isPublished?: boolean;
  isArchived?: boolean;
  isPostedToInstagram?: boolean;
  allowComments?: boolean;
}

interface GetAllPostsApiResponse {
  posts: ApiPost[];
  totalDocs: number;
  limit: number;
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
      title: apiPost.title,
      content: apiPost.content,
      author: {
        id: apiPost.author._id,
        name: `${apiPost.author.firstName} ${apiPost.author.lastName}`,
        avatar: apiPost.author.profilePicture || '',
        verified: apiPost.author.verified || false,
      },
      timestamp: new Date(apiPost.createdAt),
      images: apiPost.images,
      likes: apiPost.likesCount || apiPost.likes?.length || 0,
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

    // Handle substances filter
    if (params.substances) {
      queryParams.substances = params.substances;
    }

    // New filters
    if (params.hometown) {
      queryParams.hometown = params.hometown; // Assuming hometown is a state
    }
    if (params.religion) {
      queryParams.religion = params.religion;
    }
    if (params.gender) {
      queryParams.gender = params.gender;
    }
    if (params.campusInvolvement) {
      queryParams.campusInvolvement = params.campusInvolvement;
    }
    if (params.other) {
      queryParams.other = params.other;
    }

    // Lifestyle filters
    if (params.sleepSchedule) {
      queryParams.sleepSchedule = params.sleepSchedule;
    }
    if (params.cleanliness) {
      queryParams.cleanliness = params.cleanliness;
    }
    if (params.guests) {
      queryParams.guests = params.guests;
    }
    if (params.studying) {
      queryParams.studying = params.studying;
    }
    if (params.personality?.length) {
      queryParams.personality = params.personality;
    }
    if (params.physicalActivity?.length) {
      queryParams.physicalActivity = params.physicalActivity;
    }
    if (params.pastimes?.length) {
      queryParams.pastimes = params.pastimes;
    }
    if (params.food?.length) {
      queryParams.food = params.food;
    }

    return queryParams;
  }

  // Fetch posts - backend handles all filtering, pagination, sorting
  async fetchPosts(params: FetchPostsParams = {}): Promise<ApiResponse<FetchPostsResponse>> {


    try {
      const queryParams = this.buildQueryParams(params);





      const response = await request<GetAllPostsApiResponse>({
        method: 'GET',
        url: API_ENDPOINTS.posts.getAllPosts,
        params: queryParams,
      });



      if (!response.status) {
        throw new Error(response.message || 'Failed to fetch posts');
      }



      const transformedPosts = response.data.posts.map(this.transformApiPost);

      return {
        data: {
          posts: transformedPosts,
          limit: response.data.limit,
          totalDocs: response.data.totalDocs,
          page: response.data.page,
          totalPages: response.data.totalPages,

        },
        status: true,
        message: response.message || `Successfully fetched ${transformedPosts.length} posts`
      };

    } catch (error) {
      console.error('FeedService: Error during fetchPosts:', error);
      throw error; // Re-throw the error to be handled by the store
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
      throw error;
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
      return {
        data: [],
        status: true,
        message: 'Trending topics feature not implemented yet'
      };
    } catch (error) {
      console.error('Feed Service Error:', error);
      throw error;
    }
  }

  // Fetch current user's posts - API returns single post, not array
  async fetchUserPosts(params: { page?: number; limit?: number } = {}): Promise<ApiResponse<FetchPostsResponse>> {


    try {
      const queryParams: Record<string, string> = {};
      if (params.page) queryParams.page = params.page.toString();
      if (params.limit) queryParams.limit = params.limit.toString();




      const response = await request<ApiPost>({
        method: 'GET',
        url: API_ENDPOINTS.posts.getUserPosts,
        params: queryParams,
      });



      if (!response.status) {
        throw new Error(response.message || 'Failed to fetch user posts');
      }

      // Transform single post to array
      const transformedPost = this.transformApiPost(response.data);
      const transformedPosts = [transformedPost];



      return {
        data: {
          posts: transformedPosts,
          limit: 1,
          totalDocs: 1,
          page: 1,
          totalPages: 1,

        },
        status: true,
        message: response.message || `Successfully fetched user post`
      };

    } catch (error) {
      console.error('FeedService: Error during fetchUserPosts:', error);
      throw error;
    }
  }

  // Create a new post
  async createPost(postData: { title: string; content: string; images?: string[] }): Promise<ApiResponse<Post>> {


    try {
      const response = await request<ApiPost>({
        method: 'POST',
        url: API_ENDPOINTS.posts.createPost,
        data: postData,
      });



      if (!response.status) {
        throw new Error(response.message || 'Failed to create post');
      }

      const transformedPost = this.transformApiPost(response.data);

      return {
        data: transformedPost,
        status: true,
        message: response.message || 'Post created successfully'
      };

    } catch (error) {
      console.error('FeedService: Error during createPost:', error);
      throw error;
    }
  }

  // Update a post - matches CreatePostDto structure
  async updatePost(postId: string, updateData: { title: string; content?: string; images?: string[] }): Promise<ApiResponse<Post>> {

    try {
      const response = await request<ApiPost>({
        method: 'PATCH',
        url: API_ENDPOINTS.posts.updatePost(postId),
        data: updateData,
      });

      if (!response.status) {
        throw new Error(response.message || 'Failed to update post');
      }

      const transformedPost = this.transformApiPost(response.data);

      return {
        data: transformedPost,
        status: true,
        message: response.message || 'Post updated successfully'
      };

    } catch (error) {
      console.error('FeedService: Error during updatePost:', error);
      throw error;
    }
  }

  // Boost a post
  async boostPost(postId: string): Promise<ApiResponse<{ success: boolean; message: string }>> {


    try {
      const response = await request<{ success: boolean; message: string }>({
        method: 'PATCH',
        url: API_ENDPOINTS.posts.boostPost(postId),
      });



      if (!response.status) {
        throw new Error(response.message || 'Failed to boost post');
      }

      return {
        data: response.data,
        status: true,
        message: response.message || 'Post boosted successfully'
      };

    } catch (error) {
      console.error('FeedService: Error during boostPost:', error);
      throw error;
    }
  }

  // Delete a post
  async deletePost(postId: string): Promise<ApiResponse<{ success: boolean; message: string }>> {


    try {
      const response = await request<{ success: boolean; message: string }>({
        method: 'DELETE',
        url: API_ENDPOINTS.posts.deletePost(postId),
      });



      if (!response.status) {
        throw new Error(response.message || 'Failed to delete post');
      }

      return {
        data: response.data,
        status: true,
        message: response.message || 'Post deleted successfully'
      };

    } catch (error) {
      console.error('FeedService: Error during deletePost:', error);
      throw error;
    }
  }
}

// Export as a singleton
export const feedService = new FeedService(); 