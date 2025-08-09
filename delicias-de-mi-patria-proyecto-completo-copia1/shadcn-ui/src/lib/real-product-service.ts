import { supabase } from './supabase';
import { Product, Category } from '@/types';

export const realProductService = {
  // Products
  async getAllProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllProducts:', error);
      throw error;
    }
  },

  async getProduct(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getProduct:', error);
      throw error;
    }
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching product by slug:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getProductBySlug:', error);
      throw error;
    }
  },

  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('is_featured', true)
        .limit(6);

      if (error) {
        console.error('Error fetching featured products:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getFeaturedProducts:', error);
      throw error;
    }
  },

  async getProductsByCategory(categorySlug: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories!inner(*)
        `)
        .eq('category.slug', categorySlug);

      if (error) {
        console.error('Error fetching products by category:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getProductsByCategory:', error);
      throw error;
    }
  },

  // Categories
  async getAllCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllCategories:', error);
      throw error;
    }
  },

  async getCategory(id: string): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching category:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getCategory:', error);
      throw error;
    }
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching category by slug:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getCategoryBySlug:', error);
      throw error;
    }
  }
};