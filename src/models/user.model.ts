/**
 * User model interfaces
 */

export enum Role {
  Student = "student",
  Admin = "admin",
}

export enum ProfileStage {
  COLLEGE_SELECTION = "COLLEGE_SELECTION",
  UPLOAD_PHOTOS = "UPLOAD_PHOTOS",
  ABOUT_YOU = "ABOUT_YOU",
  PREFERENCES = "PREFERENCES",
  PROFILE_PREVIEW = "PROFILE_PREVIEW",
  PAYMENT = "PAYMENT",
}

export enum StepStage {
  BASIC_INFO = 'BASIC_INFO',
  PREFERENCES = 'PREFERENCES',
  SOCIAL_LINKS = 'SOCIAL_LINKS',
  FINALIZE = 'FINALIZE',
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

export enum Housing {
  OffCampus = "offcampus",
  Hostel = "hostel",
  Apartment = "apartment",
}

export enum Religion {
  Christian = "Christian",
  Muslim = "Muslim",
  Hindu = "Hindu",
  Jewish = "Jewish",
  Buddhist = "Buddhist",
  Atheist = "Atheist",
  Jain = "Jain",
  Other = "Other",
}

export enum Zodiac {
  Aries = "Aries",
  Taurus = "Taurus",
  Gemini = "Gemini",
  Cancer = "Cancer",
  Leo = "Leo",
  Virgo = "Virgo",
  Libra = "Libra",
  Scorpio = "Scorpio",
  Sagittarius = "Sagittarius",
  Capricorn = "Capricorn",
  Aquarius = "Aquarius",
  Pisces = "Pisces",
}

export interface Location {
  type: "Point";
  coordinates: [number, number];
}

export interface ProfileSteps {
  basicInfo: boolean;
  preferences: boolean;
  socialLinks: boolean;
  finalize: boolean;
}

export interface College {
  _id?: string;
  id?: string;
  name: string;
}

/**
 * User response structure from /auth/me endpoint
 */
export interface UserResponse {
  user: User;
}

export interface User {
  _id?: string;
  id?: string; // Keep both _id and id for compatibility
  firstName?: string;
  lastName?: string;
  dob?: Date;
  email: string;
  password?: string;
  college?: College | string; // Can be either College object or string ID
  hometown?: string;
  profilePicture?: string;
  photos?: string[];
  aspectRatio?: string; // Add aspectRatio field
  profileStage: ProfileStage;
  housing?: Housing;
  religion?: Religion;
  zodiac?: Zodiac;
  personality?: string[];
  sleepSchedule?: string;
  cleanliness?: string;
  guests?: string;
  substances?: string;
  studying?: string;
  lookingForRoommate?: boolean;
  pastimes?: string[];
  interests?: string[];
  instagram?: string;
  snapchat?: string;
  collegeGraduationYear?: string;
  twitter?: string;
  gender?: Gender;
  token?: string;
  mobileNumber?: string;
  bio?: string;
  isPhoneVerified: boolean;
  isProfileCompleted: boolean;
  resetTokenExpiration?: Date;
  otp?: string;
  address?: string;
  location?: Location;
  status: 'active' | 'inactive' | 'pending' | 'banned';
  role: Role;
  isPremium: boolean;
  isApproved: boolean;
  allowPublish: boolean;
  profileSteps: ProfileSteps;
  currentStep: StepStage;
  major?: string;
  university?: string;
  physicalActivity?: string[];
  food?: string[];
  other?: string[];
  campusInvolvement?: string;
  postPaymentDone: boolean;
  isPostedToInstagram: boolean;
  isSubscribed: boolean;
  isStarterSubscribed?: boolean; // New flag for starter pack
  subscriptionBumpCount?: number; // New counter for boosts
  subscriptionEditCount?: number; // New counter for edits
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  post?: {
    id: string;
    title?: string;
    content: string;
    images?: string[];
  };
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
  photos?: string[]; // Add photos array support
  aspectRatio?: string; // Add aspectRatio field
  isProfileCompleted?: boolean;
  // Additional profile fields
  major?: string;
  hometown?: string;
  university?: string;
  college?: string; // College ID
  batch?: string;
  collegeGraduationYear?: string;
  lookingForRoommate?: boolean;
  instagram?: string;
  snapchat?: string;
  
  // Traits and preferences
  sleepSchedule?: string;
  cleanliness?: string;
  guests?: string;
  studying?: string;
  substances?: string;
  personality?: string[];
  physicalActivity?: string[];
  pastimes?: string[];
  food?: string[];
  other?: string[];
  campusInvolvement?: string;
  
  // Nested traits object (alternative structure for certain components)
  traits?: {
    sleepSchedule?: string;
    cleanliness?: string;
    guests?: string;
    studying?: string;
    substances?: string;
    personality?: string[];
    physicalActivity?: string[];
    pastimes?: string[];
    food?: string[];
    other?: string | string[];
  };
  
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