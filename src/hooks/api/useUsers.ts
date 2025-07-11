import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersService } from '../../services';
import { transactionsService } from '../../services/transactions.service';
import type { UpdateProfileData, User } from '../../models/user.model';
import type { IServerResponse } from '../../models/serverResponse.model';
import { authKeys } from './useAuth';
import { useAuthStore } from '../../store/auth.store';

/**
 * React Query key factory for user-related queries
 */
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  user: (id: string) => [...userKeys.all, 'user', id] as const,
  profile: (id: string) => [...userKeys.all, 'profile', id] as const,
  currentUser: () => [...userKeys.all, 'me'] as const,
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
 * @param userId The ID of the user whose profile is being updated
 * @returns Mutation function and state for updating user profile
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
          message: 'User profile updated',
          data: data.data
        });
        
        // Update profile cache if it exists
        queryClient.setQueryData(userKeys.profile(userId), {
          status: true,
          message: 'User profile updated',
          data: data.data
        });
        
        // Also update the current user data if it's the same user
        // This ensures the updated profile is reflected everywhere in the UI
        const { user, setUser } = useAuthStore.getState();
        if(user?.id === userId){
          setUser(data.data)
        }
        queryClient.setQueryData(authKeys.currentUser(), (oldData) => {
          // Check if this is the current user's data
          const currentUser = oldData as IServerResponse<User> | undefined;
          if (currentUser?.data?.id === userId) {
            return {
              ...currentUser,
              data: data.data,
              message: 'User profile updated'
            };
          }
          return oldData;
        });
      }
    }
  });
};

/**
 * Hook for updating the current user's profile
 * @returns Mutation function and state for updating current user profile
 */
export const useUpdateCurrentUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IServerResponse<User>, 
    Error,
    UpdateProfileData
  >({
    mutationFn: (profileData) => usersService.updateCurrentUserProfile(profileData),
    onSuccess: (data) => {
      if (data.status && data.data) {
        const userId = data.data.id;
        
        // Update current user in cache
        queryClient.setQueryData(authKeys.currentUser(), {
          status: true,
          message: 'User profile updated',
          data: data.data
        });
        
        // Update Zustand store
        const { setUser } = useAuthStore.getState();
        setUser(data.data);
        
        // Also update the user-specific cache to ensure consistency
        if (userId) {
          queryClient.setQueryData(userKeys.user(userId), {
            status: true,
            message: 'User profile updated',
            data: data.data
          });
          
          queryClient.setQueryData(userKeys.profile(userId), {
            status: true,
            message: 'User profile updated',
            data: data.data
          });
        }
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
      queryClient.removeQueries({ queryKey: userKeys.profile(userId) });
      
      // Remove all user-related data
      queryClient.removeQueries({ queryKey: userKeys.all });
      
      // This is often followed by a logout, but that's handled by the component
    }
  });
};

/**
 * Hook for deleting the current user's account
 */
export const useDeleteCurrentUserAccount = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IServerResponse, 
    Error,
    void
  >({
    mutationFn: () => usersService.deleteCurrentUserAccount(),
    onSuccess: () => {
      // Clear all user data from cache
      queryClient.removeQueries({ queryKey: userKeys.all });
      
      // Clear auth data
      queryClient.removeQueries({ queryKey: authKeys.all });
      
      // This should be followed by a logout redirect, handled by the component
    }
  });
};

/**
 * Hook for fetching current user's transactions
 */
export const useCurrentUserTransactions = () => {
  return useQuery({
    queryKey: [...userKeys.currentUser(), 'transactions'],
    queryFn: () => transactionsService.getAllTransactions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}; 