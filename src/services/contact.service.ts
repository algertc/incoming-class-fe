import { request } from '../hooks/api/http.client';
import type { IServerResponse } from '../models/serverResponse.model';

export interface ContactFormData {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
}

export const contactService = {
  sendContactForm: async (data: ContactFormData): Promise<IServerResponse<void>> => {
    try {
      const response = await request<void>({
        method: 'POST',
        url: '/contact-us',
        data
      });

      return response;
    } catch (error) {
      return {
        status: false,
        data: undefined,
        message: error instanceof Error ? error.message : 'Failed to send contact form'
      };
    }
  }
}; 