import { loadStripe } from '@stripe/stripe-js';

// Stripe configuration
const stripeConfig = {
  publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY_HERE',
};

// Initialize Stripe
export const stripePromise = loadStripe(stripeConfig.publishableKey);

export default stripeConfig;