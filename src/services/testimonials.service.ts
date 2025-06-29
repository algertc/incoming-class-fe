import { request } from '../hooks/api/http.client';
import type { IServerResponse } from '../models/serverResponse.model';

export interface Testimonial {
  id: string;
  name: string;
  profileImage: string;
  message: string;
}

export interface TestimonialSearchParams {
  page?: number;
  limit?: number;
  collegeId?: string;
}

export interface TestimonialsResponse {
  testimonials: Testimonial[];
  totalDocs: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export const testimonialService = {
  getTestimonials: async (params: TestimonialSearchParams = {}): Promise<IServerResponse<TestimonialsResponse>> => {
    try {
      const response = await request<TestimonialsResponse>({ 
        method: 'GET', 
        url: '/testimonials/all',
        params: {
          page: params.page || 1,
          limit: params.limit || 10
        }
      });

      return response;
    } catch (error) {
      return {
        status: false,
        data: {
          testimonials: [],
          totalDocs: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
          nextPage: null,
          prevPage: null
        },
        message: error instanceof Error ? error.message : 'Failed to fetch testimonials'
      };
    }
  },

  getFeaturedTestimonials: async (): Promise<IServerResponse<TestimonialsResponse>> => {
    try {
      const response = await request<TestimonialsResponse>({ 
        method: 'GET', 
        url: '/testimonials'
      });


      return response;
    } catch (error) {
      return {
        status: false,
        data: {
          testimonials: [],
          totalDocs: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
          nextPage: null,
          prevPage: null
        },
        message: error instanceof Error ? error.message : 'Failed to fetch featured testimonials'
      };
    }
  },

  getTestimonialsByCollege: async (collegeId: string, params: TestimonialSearchParams = {}): Promise<IServerResponse<TestimonialsResponse>> => {
    try {
      const response = await request<TestimonialsResponse>({ 
        method: 'GET', 
        url: `/testimonials/college/${collegeId}`,
        params: {
          page: params.page || 1,
          limit: params.limit || 10
        }
      });

      return response;
    } catch (error) {
      return {
        status: false,
        data: {
          testimonials: [],
          totalDocs: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
          nextPage: null,
          prevPage: null
        },
        message: error instanceof Error ? error.message : 'Failed to fetch college testimonials'
      };
    }
  }
}; 