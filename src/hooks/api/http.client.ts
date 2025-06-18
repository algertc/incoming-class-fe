import axios from 'axios';
import type { AxiosRequestConfig, AxiosError } from 'axios';
import type { IServerResponse } from '../../models/serverResponse.model';

// const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api/v1';
const baseURL='https://api.incomingclass.com/api/v1'

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
    console.log("the error in axios  ?: ", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<IServerResponse>;
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