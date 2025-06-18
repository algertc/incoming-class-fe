// Stripe Configuration
export const stripeConfig = {
  // Stripe publishable key from environment variables
  publishableKey:"pk_test_51RYLjuBF0QSYoJotsoRyCP3lnprs1YCqaVPT6oTZ3yQvielG4VFhjtGlpxLB6jZwSeScQXkBV4z5ormYPC8Etude00neyKL6zK",
  
  // Stripe appearance configuration for consistent theming
  appearance: {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#4F46E5', // Indigo color to match your theme
      colorBackground: '#1A1B23',
      colorText: '#FFFFFF',
      colorDanger: '#EF4444',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
    rules: {
      '.Input': {
        backgroundColor: '#2D3748',
        border: '1px solid #4A5568',
        color: '#FFFFFF',
      },
      '.Input:focus': {
        border: '1px solid #4F46E5',
        boxShadow: '0 0 0 1px #4F46E5',
      },
      '.Label': {
        color: '#E2E8F0',
        fontWeight: '500',
      },
    },
  },
  
  // Payment Element options
  paymentElementOptions: {
    layout: {
      type: 'tabs' as const,
      defaultCollapsed: false,
    },
  },
  
  // Confirmation options
  confirmationOptions: {
    redirect: 'if_required' as const,
  },
} as const;

// Validate Stripe configuration
export const validateStripeConfig = (): boolean => {
  if (!stripeConfig.publishableKey) {
    console.error('VITE_STRIPE_PUBLISHABLE_KEY is not set in environment variables');
    return false;
  }
  
  if (!stripeConfig.publishableKey.startsWith('pk_')) {
    console.error('Invalid Stripe publishable key format');
    return false;
  }
  
  return true;
};

export default stripeConfig; 