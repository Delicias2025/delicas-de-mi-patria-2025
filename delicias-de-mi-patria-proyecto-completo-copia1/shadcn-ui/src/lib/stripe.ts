import { loadStripe, Stripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  throw new Error('Missing Stripe publishable key');
}

// Export a promise that resolves to the Stripe instance
export const stripePromise = loadStripe(stripePublishableKey);

// Export a function to get Stripe instance
export const getStripe = async (): Promise<Stripe | null> => {
  return await stripePromise;
};