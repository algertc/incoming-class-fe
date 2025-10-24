import axios from "axios";
import type { AxiosRequestConfig, AxiosError } from "axios";
import type { IServerResponse } from "../../models/serverResponse.model";

const baseURL = import.meta.env.VITE_APP_API ?? "http://localhost:4000/api/v1";
// const baseURL = 'https://api.incomingclass.com/api/v1';

const request = async <T = unknown>(
  options: AxiosRequestConfig
): Promise<IServerResponse<T>> => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
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
      message: response.data.message ?? "Success",
      data: response.data.data ?? response.data,
      statusCode: response.status,
    };

    return serverResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<IServerResponse>;

      // Handle authentication errors globally
      if (axiosError.response?.status === 401) {
        console.warn("HTTP Client: 401 Unauthorized");
        // Clear invalid token
        localStorage.removeItem("token");

        // Bubble the error up so caller/HOCs can handle routing
        throw new Error("Unauthorized");
      }

      // Handle network errors
      if (!axiosError.response) {
        throw new Error(
          "Network error. Please check your internet connection and try again."
        );
      }

      // Handle server errors
      if (axiosError.response.status >= 500) {
        throw new Error(
          "Server error. Please try again later or contact support if the problem persists."
        );
      }

      // Handle client errors
      if (axiosError.response.status >= 400) {
        throw new Error(
          axiosError.response?.data?.message ||
            "Bad request. Please check your input and try again."
        );
      }

      throw new Error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          "An error occurred while making the request"
      );
    }

    // Handle unexpected errors
    console.error("Unexpected error in HTTP client:", error);
    throw new Error("An unexpected error occurred. Please try again.");
  }
};

export { request };
