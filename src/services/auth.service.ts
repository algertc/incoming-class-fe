import { request } from '../http/client';
import API_ENDPOINTS from '../http/api.endpoints';
import type { IServerResponse } from '../interfaces/serverResponse.interface';
import type { 
  User, 
  LoginCredentials, 
  SignupData, 
  ResetPasswordData, 
  AuthResponse 
} from '../models/user.model';

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
   * Register new user
   */
  async signup(userData: SignupData): Promise<IServerResponse<AuthResponse>> {
    return request<AuthResponse>({
      url: API_ENDPOINTS.auth.signup,
      method: 'POST',
      data: userData
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
   */
  async getCurrentUser(): Promise<IServerResponse<User>> {
    return request<User>({
      url: API_ENDPOINTS.auth.me,
      method: 'GET'
    });
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