import { createClient } from '@supabase/supabase-js';

// Supabase credentials from environment variables
// In production, these would be set as environment variables
const supabaseUrl = 'https://supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtaXV5dWljZXNkdGp2aXBsZ21jeCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjkyMTQ4MjkzLCJleHAiOjIwMDc3MjQyOTN9.C6S_rEFzEwcO-0ojeRzOQBJwxt4ubSlRBvLGXSd0QGk';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define types for our database
export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  categoryId: number;
  stockQuantity: number;
  created_at?: string;
};

export type Category = {
  id: number;
  name: string;
  description: string;
  image: string;
};

export type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'customer';
};

export type Order = {
  id: number;
  userId: string;
  status: 'pending' | 'completed' | 'cancelled';
  totalAmount: number;
  created_at: string;
  items: OrderItem[];
  shippingAddress: string;
};

export type OrderItem = {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product?: Product;
};