import { User } from "@supabase/supabase-js";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  categoryId?: string;
  image: string;
  featured?: boolean;
  stock?: number;
}

export interface Category {
  id: string | number;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod?: string;
  paymentStatus?: 'pending' | 'completed' | 'failed';
  stripePaymentIntentId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface UserData {
  id: string;
  email: string;
  name?: string;
  isAdmin?: boolean;
}

export interface AuthState {
  user: UserData | null;
  loading: boolean;
  error: string | null;
}

export interface CartState {
  items: CartItem[];
  total: number;
}

export type PromotionType = 'fixed_amount' | 'percentage_discount' | 'registration_discount' | 'shipping_discount';

export interface Promotion {
  id: number;
  name: string;
  description?: string;
  type: PromotionType;
  value: number;
  active: boolean;
  code?: string;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  usageCount: number;
  minimumPurchase?: number;
  applicableTo?: 'all' | 'category' | 'product';
  categoryId?: number;
  productId?: number;
}

// Nueva interfaz para la información de contacto
export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  hours: string;
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  twitter?: string;
}

// Nueva interfaz para el contenido del sitio
export interface SiteContent {
  privacyPolicy: string;
  shippingPolicy: string;
  aboutUs: string;
  contactInfo: ContactInfo;
  heroImage: string;
}

// Interfaces for payment integration
export type PaymentProcessor = 'stripe' | 'paypal';

export interface PaymentMethod {
  id: string;
  name: string;
  processor: PaymentProcessor;
  active: boolean;
  description?: string;
  icon?: string;
  config: PaymentMethodConfig;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethodConfig {
  stripe?: {
    publishableKey: string;
    secretKey: string;
    webhookSecret?: string;
    paymentMethods?: ('card' | 'alipay' | 'ideal' | 'sepa_debit')[];
  };
  paypal?: {
    clientId: string;
    clientSecret: string;
    sandbox: boolean;
  };
}

export interface PaymentProcessorData {
  processor: PaymentProcessor;
  transactionId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  details?: Record<string, unknown>;
}