import { request } from '../hooks/api/http.client';
import API_ENDPOINTS from '../hooks/api/api.endpoints';
import type { IServerResponse } from '../models/serverResponse.model';
import type { User, UpdateProfileData } from '../models/user.model';

/**
 * Users Service
 * 
 * Handles all user profile and account management operations including:
 * - Retrieving user profiles
 * - Updating user profiles
 * - Deleting user accounts
 * - Managing user settings and preferences
 */
class UsersService {
  /**
   * Get user by ID
   * 
   * @param userId - The ID of the user to retrieve
   * @returns Promise with the user data
   */
  async getUserById(userId: string): Promise<IServerResponse<User>> {
    return request<User>({
      url: API_ENDPOINTS.users.getById(userId),
      method: 'GET'
    });
  }
  
  /**
   * Update user profile by ID
   * 
   * @param userId - The ID of the user to update
   * @param profileData - The profile data to update
   * @returns Promise with the updated user data
   */
  async updateProfile(userId: string, profileData: UpdateProfileData): Promise<IServerResponse<User>> {
    // Handle file upload for profile image if it's a File object
    if (profileData.profileImage && typeof profileData.profileImage !== 'string') {
      const formData = new FormData();
      
      // Add the image file to the form data
      formData.append('profileImage', profileData.profileImage as File);
      
      // Add other profile fields to form data
      Object.entries(profileData).forEach(([key, value]) => {
        if (key !== 'profileImage' && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      
      return request<User>({
        url: API_ENDPOINTS.users.updateProfile(userId),
        method: 'PATCH',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
    }
    
    // Regular JSON update if no file is present
    return request<User>({
      url: API_ENDPOINTS.users.updateProfile(userId),
      method: 'PATCH',
      data: profileData
    });
  }
  
  /**
   * Update current user's profile
   * 
   * @param profileData - The profile data to update
   * @returns Promise with the updated user data
   */
  async updateCurrentUserProfile(profileData: UpdateProfileData): Promise<IServerResponse<User>> {
    // Handle file upload for profile image if it's a File object
    if (profileData.profileImage && typeof profileData.profileImage !== 'string') {
      const formData = new FormData();
      
      // Add the image file to the form data
      formData.append('profileImage', profileData.profileImage as File);
      
      // Add other profile fields to form data
      Object.entries(profileData).forEach(([key, value]) => {
        if (key !== 'profileImage' && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      
      return request<User>({
        url: API_ENDPOINTS.users.updateCurrentUserProfile,
        method: 'PATCH',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
    }
    
    // Regular JSON update if no file is present
    return request<User>({
      url: API_ENDPOINTS.users.updateCurrentUserProfile,
      method: 'PATCH',
      data: profileData
    });
  }
  
  /**
   * Delete user account
   * 
   * @param userId - The ID of the user account to delete
   * @returns Promise with the deletion result
   */
  async deleteAccount(userId: string): Promise<IServerResponse> {
    return request({
      url: API_ENDPOINTS.users.deleteAccount(userId),
      method: 'DELETE'
    });
  }
  
  /**
   * Delete current user account
   * 
   * @returns Promise with the deletion result
   */
  async deleteCurrentUserAccount(): Promise<IServerResponse> {
    return request({
      url: API_ENDPOINTS.users.deleteCurrentUserAccount,
      method: 'DELETE'
    });
  }
}

// Export as a singleton
export const usersService = new UsersService(); 