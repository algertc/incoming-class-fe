import axios from 'axios';
import type { AxiosRequestConfig, AxiosError } from 'axios';
import type { IServerResponse } from '../../models/serverResponse.model';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api/v1';
// const baseURL='https://api.incomingclass.com/api/v1'

const request = async <T = unknown>(options: AxiosRequestConfig): Promise<IServerResponse<T>> => {
  const token = localStorage.getItem('token');
  const isPaymentRequest = options.url?.includes('/payment');
  
  // Enhanced logging for payment requests
  if (isPaymentRequest) {
    console.log("🌐 HTTP Client: Payment API request initiated");
    console.log("📡 Request details:", {
      method: options.method?.toUpperCase(),
      url: options.url,
      baseURL,
      fullUrl: `${baseURL}${options.url}`,
      hasAuth: !!token,
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9)
    });
    
    // Log request payload (without sensitive data)
    if (options.data) {
      console.log("📦 Request payload:", {
        ...options.data,
        // Mask sensitive fields if any
        timestamp: new Date().toISOString()
      });
    }
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const startTime = performance.now();

  try {
    const response = await axios({
      ...options,
      baseURL,
      headers,
    });

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Enhanced logging for payment responses
    if (isPaymentRequest) {
      console.log("✅ HTTP Client: Payment API request successful");
      console.log("📥 Response details:", {
        status: response.status,
        statusText: response.statusText,
        duration: `${duration.toFixed(2)}ms`,
        timestamp: new Date().toISOString(),
        responseSize: JSON.stringify(response.data).length
      });
      
      console.log("📊 Response data:", {
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : [],
        timestamp: new Date().toISOString()
      });
    }

    // Ensure the response matches our IServerResponse interface
    const serverResponse: IServerResponse<T> = {
      status: response.data.status ?? true,
      message: response.data.message ?? 'Success',
      data: response.data.data ?? response.data,
      statusCode: response.status,
    };

    return serverResponse;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;

    // Enhanced error logging for payment requests
    if (isPaymentRequest) {
      console.error("💥 HTTP Client: Payment API request failed");
      console.error("🔍 Error details:", {
        duration: `${duration.toFixed(2)}ms`,
        timestamp: new Date().toISOString(),
        url: options.url,
        method: options.method?.toUpperCase()
      });
    }

    console.log("the error in axios  ?: ", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<IServerResponse>;
      
      // Additional payment error logging
      if (isPaymentRequest) {
        console.error("🚨 Payment API Error:", {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          errorMessage: axiosError.response?.data?.errorMessage?.message,
          errorData: axiosError.response?.data,
          timestamp: new Date().toISOString()
        });
      }
      
      throw new Error(
        axiosError.response?.data?.errorMessage?.message ||
        axiosError.message ||
        'An error occurred while making the request'
      );
    }
    throw error;
  }
};

export { request }; 