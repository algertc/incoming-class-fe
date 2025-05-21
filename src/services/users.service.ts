import { request } from '../hooks/api/http.client';
import API_ENDPOINTS from '../hooks/api/api.endpoints';
import type { IServerResponse } from '../models/serverResponse.model';
import type { User, UpdateProfileData } from '../models/user.model';

/**
 * Users Service
 * 
 * Handles all user profile and account management operations
 */
class UsersService {
  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<IServerResponse<User>> {
    return request<User>({
      url: API_ENDPOINTS.users.getById(userId),
      method: 'GET'
    });
  }
  
  /**
   * Update user profile
   */
  async updateProfile(userId: string, profileData: UpdateProfileData): Promise<IServerResponse<User>> {
    return request<User>({
      url: API_ENDPOINTS.users.updateProfile(userId),
      method: 'PATCH',
      data: profileData
    });
  }
  
  /**
   * Delete user account
   */
  async deleteAccount(userId: string): Promise<IServerResponse> {
    return request({
      url: API_ENDPOINTS.users.deleteAccount(userId),
      method: 'DELETE'
    });
  }
}

// Export as a singleton
export const usersService = new UsersService(); 