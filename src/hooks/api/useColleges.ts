import { useQuery } from '@tanstack/react-query';
import { request } from './http.client';
import type { College, CollegeSearchParams } from './types';
import type { IServerResponse } from '../../models/serverResponse.model';

// Key factory for college queries
export const collegeKeys = {
  all: ['colleges'] as const,
  lists: () => [...collegeKeys.all, 'list'] as const,
  list: (filters: CollegeSearchParams) => [...collegeKeys.lists(), filters] as const,
  details: () => [...collegeKeys.all, 'detail'] as const,
  detail: (id: string) => [...collegeKeys.details(), id] as const,
  featured: () => [...collegeKeys.lists(), 'featured'] as const,
};

/**
 * Hook to fetch featured colleges
 */

type CollegeType=College & {totalStudents:number}
export const useFeaturedColleges = () => {
  return useQuery<IServerResponse<CollegeType[] >>({
    queryKey: collegeKeys.featured(),
    queryFn: async () => await request({url:'/colleges/getPopularColleges'}),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook to search for colleges
 */
export const useCollegeSearch = (params: CollegeSearchParams) => {
  return useQuery<IServerResponse<{colleges:College[], totalDocs:number , page:number , limit:number}>>({
    queryKey: collegeKeys.list(params),
    queryFn: async () => await request({url:'/colleges/getAllColleges', params }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch all colleges without pagination for filter dropdowns.
 */
export const useAllColleges = () => {
  return useQuery<IServerResponse<{colleges:College[], totalDocs:number , page:number , limit:number}>>({
    queryKey: collegeKeys.lists(), // Use a general key for all colleges list
    queryFn: async () => await request({url:'/colleges/getAllColleges', params: { limit: 10000 } }), // Fetch a large number to get all
    staleTime: 1000 * 60 * 60, // 1 hour, since this data is static
  });
};

/**
 * Hook to fetch a single college
 */
export const useCollege = (id: string) => {
  return useQuery<IServerResponse<College>>({
    queryKey: collegeKeys.detail(id),
    queryFn: async () => await request({url:`/colleges/${id}`}),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}; 