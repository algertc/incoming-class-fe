import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../../services';
import type { LoginCredentials, SignupData, ResetPasswordData } from '../../models/user.model';
import { useNavigate } from 'react-router';
import ROUTES from '../../constants/routes';

/**
 * React Query key factory for auth-related queries
 */
export const authKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authKeys.all, 'me'] as const,
  forgotPassword: (email: string) => [...authKeys.all, 'forgotPassword', email] as const,
};

/**
 * Hook for logging in a user
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      if (data.status && data.data?.token) {
        // Store token in localStorage
        localStorage.setItem('token', data.data.token);

        // Update user cache
        queryClient.setQueryData(authKeys.currentUser(), {
          status: true,
          message: 'User profile retrieved',
          data: data.data.user
        });

        // Navigate to home page
        navigate(ROUTES.HOME);
      }
    }
  });
};

/**
 * Hook for signing up a new user
 */
export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: SignupData) => authService.signup(userData),
    onSuccess: (data) => {
      if (data.status && data.data?.token) {
        // Store token in localStorage
        localStorage.setItem('token', data.data.token);

        // Update user cache
        queryClient.setQueryData(authKeys.currentUser(), {
          status: true,
          message: 'User profile retrieved',
          data: data.data.user
        });

      }
    }
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (data: { email: string, otp: string }) => authService.verifyEmailOTP(data),

  })
}

/**
 * Hook for getting the current user's profile
 */
export const useCurrentUser = () => {
  const token = localStorage.getItem('token');

  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: () => authService.getCurrentUser(),
    enabled: !!token, // Only run if token exists
    retry: 1, // Retry once if fails
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for sending a password reset request (OTP)
 */
export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: (email: string) => authService.requestPasswordReset(email)
  });
};

/**
 * Hook for resetting password with OTP
 */
export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ResetPasswordData) => authService.resetPassword(data),
    onSuccess: (data) => {
      if (data.status) {
        // Navigate to login page after successful reset
        setTimeout(() => {
          navigate(ROUTES.LOGIN);
        }, 2000); // Allow time for success message to be shown
      }
    }
  });
};

/**
 * Hook for logging out
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => {
      authService.logout();
      return Promise.resolve({ status: true, message: 'Logged out successfully' });
    },
    onSuccess: () => {
      // Clear the query cache for auth-related queries
      queryClient.removeQueries({ queryKey: authKeys.all });

      // Navigate to login
      navigate(ROUTES.LOGIN);
    }
  });
}; 