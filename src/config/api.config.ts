// API Configuration
export const API_CONFIG = {
  // Base URL for the API - can be overridden by environment variable
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  
  // API endpoints
  ENDPOINTS: {
    GET_ALL_POSTS: '/post/getAllPosts',
    CREATE_POST: '/post/create',
    LIKE_POST: '/post/like',
    COMMENT_POST: '/post/comment',
  },
  
  // Request timeouts
  TIMEOUT: 30000, // 30 seconds
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;

export default API_CONFIG; 