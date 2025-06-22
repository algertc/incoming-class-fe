import { request } from '../hooks/api/http.client';
import type { IServerResponse } from '../models/serverResponse.model';

export interface LandingPageStats {
  totalUsers: number;
  totalColleges: number;
  totalPosts: number;
}

export const statsService = {
  getLandingPageStats: async (): Promise<IServerResponse<LandingPageStats>> => {
    try {
      const response = await request<LandingPageStats>({
        method: 'GET',
        url: '/recent-activity/landing-page-stats'
      });

      return response;
    } catch (error) {
      return {
        status: false,
        data: {
          totalUsers: 0,
          totalColleges: 0,
          totalPosts: 0
        },
        message: error instanceof Error ? error.message : 'Failed to fetch landing page stats'
      };
    }
  }
}; 