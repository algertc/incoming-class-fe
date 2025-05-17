// Common API response types
export interface IServerResponse<T = any> {
  status: boolean;
  message: string;
  data: T;
}

// Authentication types
export interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  role: 'student' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  profilePicture?: string;
  currentPassword?: string;
  newPassword?: string;
}

// College types
export interface College {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  location?: string;
  studentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CollegeSearchParams {
  query?: string;
  location?: string;
  limit?: number;
  page?: number;
} 