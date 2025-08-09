import { PaymentMethod, PaymentProcessor, PaymentProcessorData } from "@/types";

// Mock database of payment methods
let paymentMethods: PaymentMethod[] = [
  {
    id: "stripe-1",
    name: "Tarjeta de Crédito/Débito",
    processor: "stripe",
    active: true,
    description: "Paga de forma segura con tu tarjeta de crédito o débito.",
    icon: "credit-card",
    config: {
      stripe: {
        publishableKey: "pk_test_sample",
        secretKey: "sk_test_sample",
        paymentMethods: ["card"]
      }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Get all payment methods
export const getAllPaymentMethods = async (): Promise<PaymentMethod[]> => {
  // In a real app, this would fetch from database
  return paymentMethods.filter(method => method.active);
};

// Get all payment methods (including inactive) - admin only
export const getAllPaymentMethodsAdmin = async (): Promise<PaymentMethod[]> => {
  // In a real app, this would fetch from database
  return [...paymentMethods];
};

// Get payment method by ID
export const getPaymentMethodById = async (id: string): Promise<PaymentMethod | null> => {
  // In a real app, this would fetch from database
  const method = paymentMethods.find(method => method.id === id);
  return method || null;
};

// Create a new payment method
export const createPaymentMethod = async (
  name: string,
  processor: PaymentProcessor,
  config: PaymentMethod["config"],
  description?: string,
  icon?: string
): Promise<PaymentMethod> => {
  // In a real app, this would save to database
  const newMethod: PaymentMethod = {
    id: `${processor}-${Date.now()}`,
    name,
    processor,
    active: true,
    description,
    icon,
    config,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  paymentMethods = [...paymentMethods, newMethod];
  
  return newMethod;
};

// Update a payment method
export const updatePaymentMethod = async (
  id: string,
  updates: Partial<Omit<PaymentMethod, "id" | "createdAt">>
): Promise<PaymentMethod | null> => {
  // In a real app, this would update in database
  const methodIndex = paymentMethods.findIndex(method => method.id === id);
  
  if (methodIndex === -1) {
    return null;
  }
  
  const updatedMethod = {
    ...paymentMethods[methodIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  paymentMethods = [
    ...paymentMethods.slice(0, methodIndex),
    updatedMethod,
    ...paymentMethods.slice(methodIndex + 1)
  ];
  
  return updatedMethod;
};

// Delete a payment method
export const deletePaymentMethod = async (id: string): Promise<boolean> => {
  // In a real app, this would delete from database or mark as deleted
  const initialLength = paymentMethods.length;
  paymentMethods = paymentMethods.filter(method => method.id !== id);
  
  return paymentMethods.length !== initialLength;
};

// Process payment with Stripe
export const processStripePayment = async (
  paymentMethodId: string,
  amount: number,
  currency: string = "usd",
  paymentDetails: Record<string, unknown> // This would be card details in real implementation
): Promise<PaymentProcessorData> => {
  // This is a mock implementation - in a real app, this would call Stripe API
  console.log(`Processing Stripe payment of ${amount} ${currency} with method ${paymentMethodId}`);
  
  // Validate amount
  if (!amount || amount <= 0) {
    throw new Error("Invalid payment amount");
  }
  
  // Mock success (in real app, would call Stripe.js)
  const paymentData: PaymentProcessorData = {
    processor: "stripe",
    transactionId: `stripe_${Date.now()}`,
    status: "completed",
    details: {
      cardBrand: paymentDetails.brand || "visa",
      last4: paymentDetails.last4 || "4242",
      expiryMonth: paymentDetails.expiryMonth || "12",
      expiryYear: paymentDetails.expiryYear || "2025",
      amount: amount,
      currency: currency
    }
  };
  
  // Simulate async processing
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return paymentData;
};

// PayPal payment processing removed - only Stripe supported

// Process payment based on the payment method
export const processPayment = async (
  paymentMethodId: string,
  amount: number,
  currency: string = "eur",
  paymentDetails?: Record<string, unknown>
): Promise<PaymentProcessorData> => {
  // Get the payment method
  const paymentMethod = await getPaymentMethodById(paymentMethodId);
  
  if (!paymentMethod) {
    throw new Error("Payment method not found");
  }
  
  if (!paymentMethod.active) {
    throw new Error("Payment method is not active");
  }
  
  // Process based on the processor type
  switch (paymentMethod.processor) {
    case "stripe":
      return processStripePayment(paymentMethodId, amount, currency, paymentDetails || {});
    default:
      throw new Error(`Unsupported payment processor: ${paymentMethod.processor}`);
  }
};

// For demonstration, expose the methods
export const paymentService = {
  getAllPaymentMethods,
  getAllPaymentMethodsAdmin,
  getPaymentMethodById,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  processPayment
};

export default paymentService;