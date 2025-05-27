export interface IServerResponse<T = unknown> {
  status: boolean;
  message: string;
  data: T;
  statusCode?: number;
  errorMessage?: {message: string};
} 