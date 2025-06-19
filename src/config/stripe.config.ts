// Stripe Configuration for Session-based Checkout
export const stripeConfig = {
  // Stripe publishable key from environment variables
  publishableKey: "pk_test_51RYLjuBF0QSYoJotsoRyCP3lnprs1YCqaVPT6oTZ3yQvielG4VFhjtGlpxLB6jZwSeScQXkBV4z5ormYPC8Etude00neyKL6zK",
} as const;

// Validate Stripe configuration
export const validateStripeConfig = (): boolean => {
  if (!stripeConfig.publishableKey) {
    console.error('Stripe publishable key is missing');
    return false;
  }
  
  if (!stripeConfig.publishableKey.startsWith('pk_')) {
    console.error('Invalid Stripe publishable key format');
    return false;
  }
  
  return true;
};

export default stripeConfig; 