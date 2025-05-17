import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersService } from '../../services';
import type { UpdateProfileData, User } from '../../models/user.model';
import type { IServerResponse } from '../../interfaces/serverResponse.interface';

/**
 * React Query key factory for user-related queries
 */
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  user: (id: string) => [...userKeys.all, 'user', id] as const,
};

/**
 * Hook for getting a user by ID
 */
export const useUser = (userId: string) => {
  return useQuery({
    queryKey: userKeys.user(userId),
    queryFn: () => usersService.getUserById(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for updating a user's profile
 */
export const useUpdateProfile = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    IServerResponse<User>, 
    Error,
    UpdateProfileData
  >({
    mutationFn: (profileData) => usersService.updateProfile(userId, profileData),
    onSuccess: (data) => {
      if (data.status && data.data) {
        // Update user in cache
        queryClient.setQueryData(userKeys.user(userId), {
          status: true,
          message: 'User profile retrieved',
          data: data.data
        });
      }
    }
  });
};

/**
 * Hook for deleting a user account
 */
export const useDeleteAccount = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    IServerResponse, 
    Error,
    void
  >({
    mutationFn: () => usersService.deleteAccount(userId),
    onSuccess: () => {
      // Remove user from cache
      queryClient.removeQueries({ queryKey: userKeys.user(userId) });
      
      // Remove all user-related data
      queryClient.removeQueries({ queryKey: userKeys.all });
      
      // This is often followed by a logout, but that's handled by the component
    }
  });
}; 