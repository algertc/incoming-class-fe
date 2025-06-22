import { useQuery } from '@tanstack/react-query';
import { statsService } from '../../services';

// Key factory for stats queries
export const statsKeys = {
  all: ['stats'] as const,
  landingPage: () => [...statsKeys.all, 'landing-page'] as const,
};

/**
 * Hook to fetch landing page statistics
 */
export const useLandingPageStats = () => {
  return useQuery({
    queryKey: statsKeys.landingPage(),
    queryFn: () => statsService.getLandingPageStats(),
  });
}; 