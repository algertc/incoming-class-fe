import { http } from '../hooks/api/http.client';
import { ServerResponse } from '../models/serverResponse.model';

interface PricingData {
  post: number;
  premium: number;
}

export const getCurrentPricing = async (): Promise<ServerResponse<PricingData>> => {
  const response = await http.get<ServerResponse<PricingData>>('/pricing');
  return response.data;
}; 