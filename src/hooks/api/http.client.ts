import axios from 'axios';
import type { AxiosRequestConfig, AxiosError } from 'axios';
import type { IServerResponse } from '../../models/serverResponse.model';

// const baseURL = import.meta.env.VITE_APP_API ?? 'http://192.168.1.10:4000/api/v1';
const baseURL = 'https://api.incomingclass.com/api/v1';

const request = async <T = unknown>(options: AxiosRequestConfig): Promise<IServerResponse<T>> => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await axios({
      ...options,
      baseURL,
      headers,
    });

    // Ensure the response matches our IServerResponse interface
    const serverResponse: IServerResponse<T> = {
      status: response.data.status ?? true,
      message: response.data.message ?? 'Success',
      data: response.data.data ?? response.data,
      statusCode: response.status,
    };

    return serverResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<IServerResponse>;

      // Handle authentication errors globally
      if (axiosError.response?.status === 401) {
        console.warn('HTTP Client: 401 Unauthorized');
        // Clear invalid token
        localStorage.removeItem('token');

        // Bubble the error up so caller/HOCs can handle routing
        throw new Error('Unauthorized');
      }

      throw new Error(
        axiosError.response?.data?.message ||
        axiosError.message ||
        'An error occurred while making the request'
      );
    }
    throw error;
  }
};

export { request }; 