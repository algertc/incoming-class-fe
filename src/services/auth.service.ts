import { request } from '../hooks/api/http.client';
import API_ENDPOINTS from '../hooks/api/api.endpoints';
import type { IServerResponse } from '../models/serverResponse.model';
import type {
  UserResponse,
  LoginCredentials,
  SignupData,
  ResetPasswordData,
  AuthResponse
} from '../models/user.model';

// Mock user data for development
// const MOCK_USER: User = {
//   id: '1',
//   firstName: 'John',
//   lastName: 'Doe',
//   email: 'john.doe@example.com',
//   profileImage: 'https://i.pravatar.cc/150?img=1',
//   bio: 'Software Developer | Tech Enthusiast',
//   createdAt: new Date().toISOString(),
//   updatedAt: new Date().toISOString()
// };

/**
 * Authentication Service
 * 
 * Handles all authentication related API calls, including:
 * - Login
 * - Registration
 * - Password reset flow
 * - User profile
 */
class AuthService {

  async sendEmailOtp(email: string) {
    return request({
      url: API_ENDPOINTS.auth.sendEmailOtp,
      method: "POST",
      data: { email }
    })
  }

  /**
   * Register new user
   */
  async verifyEmailOTP(userData: SignupData): Promise<IServerResponse<AuthResponse>> {
    return request<AuthResponse>({
      url: API_ENDPOINTS.auth.signup,
      method: 'POST',
      data: userData
    });
  }

  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<IServerResponse<AuthResponse>> {
    return request<AuthResponse>({
      url: API_ENDPOINTS.auth.login,
      method: 'POST',
      data: credentials
    });
  }

  /**
   * Request password reset OTP
   */
  async requestPasswordReset(email: string): Promise<IServerResponse> {
    return request({
      url: API_ENDPOINTS.auth.forgotPassword,
      method: 'POST',
      data: { email }
    });
  }

  /**
   * Reset password with OTP
   */
  async resetPassword(data: ResetPasswordData): Promise<IServerResponse> {
    return request({
      url: API_ENDPOINTS.auth.resetPassword,
      method: 'POST',
      data
    });
  }

  /**
   * Get current user profile
   * Mock implementation for development
   */
  async getCurrentUser(): Promise<IServerResponse<UserResponse>> {
    // Simulate API delay
    return request({
      url: API_ENDPOINTS.auth.me
    })
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('token');
    // Optionally make an API call to invalidate the token on the server
    // request({ 
    //   url: API_ENDPOINTS.auth.logout, 
    //   method: 'POST' 
    // });
  }
}

// Export as a singleton
export const authService = new AuthService(); 