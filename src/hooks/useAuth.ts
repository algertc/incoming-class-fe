import { useState, useCallback } from 'react';
import { request } from './api/http.client';
import API_ENDPOINTS from './api/api.endpoints';
import type { AxiosRequestConfig } from 'axios';

interface LoginResponse {
  token: string;
  isProfileComplete: boolean;
}

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const login = useCallback(async (email: string, password: string): Promise<LoginResponse> => {
    const config: AxiosRequestConfig = {
      method: 'POST',
      url: API_ENDPOINTS.auth.login,
      data: {
        email,
        password,
      },
    };

    const response = await request<LoginResponse>(config);
    const { token, isProfileComplete } = response.data;
    localStorage.setItem('token', token);
    setToken(token);

    return { token, isProfileComplete };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
  }, []);

  const isAuthenticated = useCallback(() => {
    return !!token;
  }, [token]);

  return {
    token,
    login,
    logout,
    isAuthenticated,
  };
}; 