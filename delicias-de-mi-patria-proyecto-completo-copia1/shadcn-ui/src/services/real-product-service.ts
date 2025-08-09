import { supabase, Product, Category } from '../lib/supabase';

export class RealProductService {
  // =============================================
  // CATEGORIES MANAGEMENT
  // =============================================
  
  async getAllCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name');
    
    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
    
    return data || [];
  }

  async getAllCategoriesForAdmin(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching categories for admin:', error);
      throw error;
    }
    
    return data || [];
  }

  async createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating category:', error);
      throw error;
    }
    
    return data;
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating category:', error);
      throw error;
    }
    
    return data;
  }

  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  // =============================================
  // PRODUCTS MANAGEMENT
  // =============================================

  async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
    
    return data || [];
  }

  async getAllProductsForAdmin(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products for admin:', error);
      throw error;
    }
    
    return data || [];
  }

  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single();
    
    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }
    
    return data;
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
    
    if (error) {
      console.error('Error fetching product by slug:', error);
      return null;
    }
    
    return data;
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
    
    return data || [];
  }

  async searchProducts(query: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*)
      `)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error searching products:', error);
      throw error;
    }
    
    return data || [];
  }

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category'>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select(`
        *,
        category:categories(*)
      `)
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      throw error;
    }
    
    return data;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        category:categories(*)
      `)
      .single();
    
    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }
    
    return data;
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  async updateStock(id: string, quantity: number): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update({ stock_quantity: quantity })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }

  // =============================================
  // REALTIME SUBSCRIPTIONS
  // =============================================

  subscribeToCategories(callback: (payload: any) => void) {
    return supabase
      .channel('categories_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, callback)
      .subscribe();
  }

  subscribeToProducts(callback: (payload: any) => void) {
    return supabase
      .channel('products_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, callback)
      .subscribe();
  }
}

export const realProductService = new RealProductService();