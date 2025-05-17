export interface IServerResponse<T = unknown> {
  status: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
  statusCode?: number;
} 