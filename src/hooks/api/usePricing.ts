import { useQuery } from '@tanstack/react-query';
import { request } from './http.client';

interface PricingData {
  post: number;
  premium: number;
  subscription: number;
}

const pricingKeys = {
  all: ['pricing'] as const,
  current: () => [...pricingKeys.all, 'current'] as const,
};

export const usePricing = () => {
  return useQuery({
    queryKey: pricingKeys.current(),
    queryFn: async () => {
      const response = await request<PricingData>({
        url: '/pricing',
        method: 'GET',
      });
      return response;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });
};

export { pricingKeys }; 