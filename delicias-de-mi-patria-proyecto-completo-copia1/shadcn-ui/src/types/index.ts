export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CategoryType;
  image: string;
  featured?: boolean;
}

export type CategoryType = 
  | 'bebidas'
  | 'antojitos'
  | 'cafe'
  | 'golosinas'
  | 'comida'
  | 'medicina';

export interface Category {
  id: CategoryType;
  name: string;
  description: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  address?: string;
  phone?: string;
}

export type ShippingMethod = 'standard' | 'express';

export interface ShippingOption {
  id: ShippingMethod;
  name: string;
  price: number;
  description: string;
  estimatedDelivery: string;
}