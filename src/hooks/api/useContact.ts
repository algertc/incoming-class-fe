import { useMutation } from '@tanstack/react-query';
import { contactService, type ContactFormData } from '../../services/contact.service';

/**
 * Hook to send contact form data
 */
export const useContact = () => {
  return useMutation({
    mutationFn: (data: ContactFormData) => contactService.sendContactForm(data)
  });
};
