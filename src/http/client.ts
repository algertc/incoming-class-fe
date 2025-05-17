import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { ENV } from "../config/env";
import ROUTES from "../constants/routes";
import type { IServerResponse } from "../interfaces/serverResponse.interface";

/**
 * Base Axios client instance with common configuration
 */
const client = axios.create({
  baseURL: ENV.VITE_APP_API,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

/**
 * Make an HTTP request with automatic token handling and error processing
 * @template T - Type of data expected in the response
 * @param options - Axios request configuration
 * @returns Promise with standardized server response
 */
export const request = async <T = unknown>(options: AxiosRequestConfig): Promise<IServerResponse<T>> => {
  // Add authentication token if available
  const token = localStorage.getItem("token");
  if (token) {
    client.defaults.headers.common.authorization = `Bearer ${token}`;
  }
  
  const onSuccess = (response: AxiosResponse): IServerResponse<T> => ({
    ...response.data,
  } as IServerResponse<T>);

  const onError = (error: AxiosError): IServerResponse<T> => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      if (window.location.pathname !== ROUTES.LOGIN) {
        window.location.replace(ROUTES.LOGIN);
      }
    }
    
    console.error("API request error:", error.response?.data || error.message);
    
    // Get error data as an object or empty object if not available
    const errorData = error.response?.data as Record<string, unknown> || {};
    
    // Return a properly formatted error response
    return {
      status: false,
      message: (errorData.message as string) || error.message || 'An error occurred',
      statusCode: error.response?.status,
      ...errorData
    } as IServerResponse<T>;
  };

  try {
    const response = await client(options);
    return onSuccess(response);
  } catch (error) {
    return onError(error as AxiosError);
  }
};

export default client; 