// Stripe Configuration for Session-based Checkout
export const stripeConfig = {
  // Stripe publishable key from environment variables
  publishableKey: "pk_live_51OqSqGB2dYPDg3OJIP3Qp1DfA5h3jeXKqKfyTXv0Ew8c3qTF7V6t3FDYrTTTWfiTvOXrLX0IneKByZdopd1PjKYl00oxSsujPk",
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