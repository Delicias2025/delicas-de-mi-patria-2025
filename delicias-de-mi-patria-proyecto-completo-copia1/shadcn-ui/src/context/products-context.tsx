import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import { supabaseProductsService } from '../lib/supabase-products-service';

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  getFeaturedProducts: () => Product[];
  searchProducts: (query: string) => Product[];
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

interface ProductsProviderProps {
  children: ReactNode;
}

export const ProductsProvider: React.FC<ProductsProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    const unsubscribe = supabaseProductsService.subscribeToProducts((updatedProducts) => {
      setProducts(updatedProducts);
    });

    return unsubscribe;
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProducts = await supabaseProductsService.getProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const refreshProducts = async () => {
    await loadProducts();
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find(product => product.id === id);
  };

  const getProductsByCategory = (category: string): Product[] => {
    if (category === 'todos' || !category) {
      return products;
    }
    return products.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  };

  const getFeaturedProducts = (): Product[] => {
    return products.filter(product => product.featured);
  };

  const searchProducts = (query: string): Product[] => {
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery) ||
      (product.tags && product.tags.some(tag => 
        tag.toLowerCase().includes(lowercaseQuery)
      ))
    );
  };

  const value: ProductsContextType = {
    products,
    loading,
    error,
    refreshProducts,
    getProductById,
    getProductsByCategory,
    getFeaturedProducts,
    searchProducts
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};