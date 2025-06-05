/**
 * User model interfaces
 */

/**
 * Basic user profile information
 */

export enum ProfileStage {
  UPLOAD_PHOTOS = "UPLOAD_PHOTOS",
  ABOUT_YOU = "ABOUT_YOU",
  PREFERENCES = "PREFERENCES",
  PROFILE_PREVIEW = "PROFILE_PREVIEW",
  PAYMENT = "PAYMENT",
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
  profileStage?: ProfileStage;
  isPremium?: boolean;
  isProfileCompleted:boolean
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
  otp: string
}

/**
 * Profile update data
 */
export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  profileImage?: string | File;
  isProfileCompleted?: boolean;
  // Additional profile fields
  major?: string;
  hometown?: string;
  university?: string;
  batch?: string;
  lookingForRoommate?: boolean;
  instagram?: string;
  snapchat?: string;
  
  // Profile stage information
  profileStage?: ProfileStage;
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
  isProfileCompleted: boolean;
} 