import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Database types
export interface Profile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  discount_price?: number;
  category_id?: string;
  image_url?: string;
  gallery_urls?: string[];
  stock_quantity: number;
  is_active: boolean;
  weight?: number;
  dimensions?: any;
  tags?: string[];
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Order {
  id: string;
  user_id?: string;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method?: string;
  payment_intent_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: any;
  subtotal: number;
  tax_amount: number;
  shipping_cost: number;
  discount_amount: number;
  total_amount: number;
  tracking_number?: string;
  shipped_at?: string;
  delivered_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id?: string;
  session_id?: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  is_read: boolean;
  replied_at?: string;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value?: string;
  type: string;
  category: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  states?: string[];
  is_active: boolean;
  created_at: string;
}

export interface ShippingRate {
  id: string;
  zone_id: string;
  name: string;
  min_weight: number;
  max_weight?: number;
  min_price: number;
  max_price?: number;
  rate: number;
  estimated_days?: string;
  is_active: boolean;
  created_at: string;
}

// Auth helpers
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getUserProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
};

export const isUserAdmin = async (userId?: string): Promise<boolean> => {
  if (!userId) return false;
  
  const profile = await getUserProfile(userId);
  return profile?.is_admin || false;
};

// Session management
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('guest_session_id');
  if (!sessionId) {
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('guest_session_id', sessionId);
  }
  return sessionId;
};