import { request } from '../hooks/api/http.client';
import type { IServerResponse } from '../models/serverResponse.model';

interface PricingData {
  post: number;
  premium: number;
}

export const getCurrentPricing = async (): Promise<IServerResponse<PricingData>> => {
  const response = await request<IServerResponse<PricingData>>({
    url: '/pricing',
    method: 'GET',
  });
  return response.data;
}; 