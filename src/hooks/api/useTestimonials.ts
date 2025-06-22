import { useQuery } from '@tanstack/react-query';
import { testimonialService, type TestimonialSearchParams } from '../../services/testimonials.service';

// Key factory for testimonial queries
export const testimonialKeys = {
  all: ['testimonials'] as const,
  lists: () => [...testimonialKeys.all, 'list'] as const,
  list: (params: TestimonialSearchParams) => [...testimonialKeys.lists(), params] as const,
  featured: () => [...testimonialKeys.lists(), 'featured'] as const,
  college: () => [...testimonialKeys.all, 'college'] as const,
  collegeList: (collegeId: string, params: TestimonialSearchParams) => [...testimonialKeys.college(), collegeId, params] as const,
};

/**
 * Hook for fetching paginated testimonials
 */
export const useTestimonials = (params: TestimonialSearchParams = {}) => {
  return useQuery({
    queryKey: testimonialKeys.list(params),
    queryFn: () => testimonialService.getTestimonials(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook for fetching featured testimonials
 */
export const useFeaturedTestimonials = () => {
  return useQuery({
    queryKey: testimonialKeys.featured(),
    queryFn: () => testimonialService.getFeaturedTestimonials(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook for fetching testimonials by college
 */
export const useCollegeTestimonials = (collegeId: string, params: TestimonialSearchParams = {}) => {
  return useQuery({
    queryKey: testimonialKeys.collegeList(collegeId, params),
    queryFn: () => testimonialService.getTestimonialsByCollege(collegeId, params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}; 