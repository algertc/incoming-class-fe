import { useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from './http.client';
import API_ENDPOINTS from './api.endpoints';
import type { IServerResponse } from '../../models/serverResponse.model';
import type { User } from '../../models/user.model';
import { authKeys } from './useAuth';


type ImageUploadResponse =string[];



export const useUploadMultipleImages = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IServerResponse<ImageUploadResponse>,
    Error,
    FormData
  >({
    mutationFn: async (formData: FormData) => {
      return request<ImageUploadResponse>({
        url: API_ENDPOINTS.users.uploadUserImages,
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: (data) => {
      if (data.status && data.data) {
        // Invalidate and refetch current user data to update the profile
        queryClient.invalidateQueries({
          queryKey: authKeys.currentUser(),
        });
        
        // Optionally update the cache directly if we want immediate updates
        queryClient.setQueryData(authKeys.currentUser(), (oldData: unknown) => {
          if (oldData && typeof oldData === 'object' && 'data' in oldData) {
            const currentUser = oldData as IServerResponse<User>;
            return {
              ...currentUser,
              data: {
                ...currentUser.data,
                // images: data.data.images,
                // profilePicture: data.data.profilePicture || currentUser.data?.profilePicture,
              },
            };
          }
          return oldData;
        });
      }
    },
  });
};

/**
 * Helper function to create FormData from files
 * 
 * Automatically sets the first image as the profile image if isProfileImage is not specified.
 * 
 * @param files - Array of File objects to upload
 * @returns FormData ready for upload
 * 
 * @example
 * ```tsx
 * const files = [file1, file2, file3];
 * const formData = createImageFormData(files);
 * // First file will be marked as profile image
 * ```
 */
export const createImageFormData = (files: File[]): FormData => {
  const formData = new FormData();
  
  files.forEach((file, index) => {
    formData.append('file', file);
    
    // Set the first image as profile image
    if (index === 0) {
      formData.append('isProfileImage', 'true');
    }
  });
  
  return formData;
};

/**
 * Validation helper for image files
 * 
 * Validates file count, size, and type according to platform requirements.
 * 
 * @param files - Array of files to validate
 * @returns Object with isValid boolean and error message if invalid
 * 
 * @example
 * ```tsx
 * const validation = validateImageFiles(selectedFiles);
 * if (!validation.isValid) {
 *   showError(validation.error);
 *   return;
 * }
 * // Proceed with upload
 * ```
 */
export const validateImageFiles = (files: File[]): { isValid: boolean; error?: string } => {
  const maxFiles = 10;
  const maxFileSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (files.length === 0) {
    return { isValid: false, error: 'Please select at least one image' };
  }

  if (files.length > maxFiles) {
    return { isValid: false, error: `You can only upload up to ${maxFiles} images` };
  }

  for (const file of files) {
    if (!allowedTypes.includes(file.type)) {
      return { 
        isValid: false, 
        error: 'Please only upload JPEG, PNG, or WebP images' 
      };
    }

    if (file.size > maxFileSize) {
      return { 
        isValid: false, 
        error: `Image "${file.name}" is too large. Maximum size is 5MB` 
      };
    }
  }

  return { isValid: true };
};

export const useUploadProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IServerResponse<ImageUploadResponse>,
    Error,
    FormData
  >({
    mutationFn: async (formData: FormData) => {
      return request<ImageUploadResponse>({
        url: API_ENDPOINTS.users.uploadUserProfile,
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: (data) => {
      if (data.status && data.data) {
        // Invalidate and refetch current user data to update the profile
        queryClient.invalidateQueries({
          queryKey: authKeys.currentUser(),
        });
        
        // Optionally update the cache directly if we want immediate updates
        queryClient.setQueryData(authKeys.currentUser(), (oldData: unknown) => {
          if (oldData && typeof oldData === 'object' && 'data' in oldData) {
            const currentUser = oldData as IServerResponse<User>;
            return {
              ...currentUser,
              data: {
                ...currentUser.data,
                // profilePicture: data.data.profilePicture || currentUser.data?.profilePicture,
              },
            };
          }
          return oldData;
        });
      }
    },
  });
};

/**
 * Helper function to create FormData for single profile image
 * 
 * @param file - Single File object to upload as profile picture
 * @returns FormData ready for upload
 * 
 * @example
 * ```tsx
 * const file = fileInput.files[0];
 * const formData = createProfileImageFormData(file);
 * ```
 */
export const createProfileImageFormData = (file: File): FormData => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('isProfileImage', 'true');
  return formData;
};

/**
 * Validation helper for single image file
 * 
 * Validates file size and type according to platform requirements.
 * 
 * @param file - File to validate
 * @returns Object with isValid boolean and error message if invalid
 * 
 * @example
 * ```tsx
 * const validation = validateSingleImageFile(selectedFile);
 * if (!validation.isValid) {
 *   showError(validation.error);
 *   return;
 * }
 * // Proceed with upload
 * ```
 */
export const validateSingleImageFile = (file: File): { isValid: boolean; error?: string } => {
  const maxFileSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!file) {
    return { isValid: false, error: 'Please select an image file' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: 'Please only upload JPEG, PNG, or WebP images' 
    };
  }

  if (file.size > maxFileSize) {
    return { 
      isValid: false, 
      error: `Image "${file.name}" is too large. Maximum size is 5MB` 
    };
  }

  return { isValid: true };
}; 