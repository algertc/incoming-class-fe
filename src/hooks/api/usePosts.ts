import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { feedService } from '../../services/feed.service';
import { notifications } from '@mantine/notifications';

// Query keys for posts
export const postKeys = {
  all: ['posts'] as const,
  userPosts: () => [...postKeys.all, 'user'] as const,
  userPostsWithParams: (params: { page?: number; limit?: number }) => 
    [...postKeys.userPosts(), params] as const,
};

// Hook to fetch current user's posts
export function useUserPosts(params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: postKeys.userPostsWithParams(params),
    queryFn: () => feedService.fetchUserPosts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook to create a new post
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postData: { title: string; content: string; images?: string[] }) => 
      feedService.createPost(postData),
    
    onSuccess: (response) => {
      // Invalidate user posts queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: postKeys.userPosts() });
      
      // Also invalidate the main feed if it exists
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      
      notifications.show({
        title: 'Success',
        message: response.message || 'Post created successfully',
        color: 'green',
      });
    },
    
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create post',
        color: 'red',
      });
    },
  });
}

// Hook to update a post
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, updateData }: { 
      postId: string; 
      updateData: { title: string; content?: string; images?: string[], aspectRatio?: string; } 
    }) => feedService.updatePost(postId, updateData),
    
    onSuccess: (response) => {
      // Invalidate user posts queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: postKeys.userPosts() });
      
      // Also invalidate the main feed if it exists
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      
      notifications.show({
        title: 'Success',
        message: response.message || 'Post updated successfully',
        color: 'green',
      });
    },
    
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update post',
        color: 'red',
      });
    },
  });
}

// Hook to boost a post
export function useBoostPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => feedService.boostPost(postId),
    
    onSuccess: (response) => {
      // Invalidate user posts queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: postKeys.userPosts() });
      
      // Also invalidate the main feed if it exists
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      
      notifications.show({
        title: 'Post Boosted!',
        message: response.message || 'Your post has been boosted successfully',
        color: 'blue',
      });
    },
    
    onError: (error: Error) => {
      notifications.show({
        title: 'Boost Failed',
        message: error.message || 'Failed to boost post',
        color: 'red',
      });
    },
  });
}

// Hook to delete a post
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => feedService.deletePost(postId),
    
    onSuccess: (response) => {
      // Invalidate user posts queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: postKeys.userPosts() });
      
      // Also invalidate the main feed if it exists
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      
      notifications.show({
        title: 'Post Deleted',
        message: response.message || 'Post deleted successfully',
        color: 'green',
      });
    },
    
    onError: (error: Error) => {
      notifications.show({
        title: 'Delete Failed',
        message: error.message || 'Failed to delete post',
        color: 'red',
      });
    },
  });
}

// Hook to get a single post (useful for editing)
export function usePost(postId: string) {
  return useQuery({
    queryKey: [...postKeys.all, postId],
    queryFn: async () => {
      // This would need to be implemented in the service if you need individual post fetching
      // For now, we'll rely on the posts being available in the user posts list
      throw new Error('Individual post fetching not implemented yet');
    },
    enabled: false, // Disable by default since we don't have individual post fetching yet
  });
} 