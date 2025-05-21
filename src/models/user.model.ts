/**
 * User model interfaces
 */

/**
 * Basic user profile information
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * New user registration data
 */
export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/**
 * Profile update data
 */
export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  profileImage?: string;
}

/**
 * Password reset request data
 */
export interface ResetPasswordData {
  email: string;
  otp: string;
  password: string;
}

/**
 * Auth response with token and user data
 */
export interface AuthResponse {
  token: string;
  user: User;
  isProfileComplete: boolean;
} 