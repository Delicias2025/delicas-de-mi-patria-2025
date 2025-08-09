import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem } from '../lib/supabase';
import { realCartService } from '../services/real-cart-service';
import { useAuth } from './real-auth-context';

interface CartContextType {
  cartItems: CartItem[];
  cartTotal: { subtotal: number; itemCount: number };
  loading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState<{ subtotal: number; itemCount: number }>({ subtotal: 0, itemCount: 0 });
  const [loading, setLoading] = useState(true);

  // Load cart items
  const loadCartItems = async () => {
    if (authLoading) return;
    
    try {
      setLoading(true);
      const items = await realCartService.getCartItems(user?.id);
      const total = await realCartService.getCartTotal(user?.id);
      
      setCartItems(items);
      setCartTotal(total);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize cart and handle user authentication changes
  useEffect(() => {
    if (!authLoading) {
      loadCartItems();
      
      // Merge guest cart when user logs in
      if (user) {
        realCartService.mergeGuestCartWithUser(user.id).then(() => {
          loadCartItems(); // Refresh after merge
        });
      }
    }
  }, [user, authLoading]);

  // Setup real-time subscriptions
  useEffect(() => {
    if (authLoading) return;
    
    const subscription = realCartService.subscribeToCartChanges(
      user?.id || null,
      (payload) => {
        console.log('🛒 Cart changed:', payload);
        loadCartItems(); // Refresh cart on any change
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id, authLoading]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      await realCartService.addToCart(productId, quantity, user?.id);
      await loadCartItems(); // Refresh cart
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(cartItemId);
      } else {
        await realCartService.updateCartItemQuantity(cartItemId, quantity);
        await loadCartItems(); // Refresh cart
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      await realCartService.removeFromCart(cartItemId);
      await loadCartItems(); // Refresh cart
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await realCartService.clearCart(user?.id);
      await loadCartItems(); // Refresh cart
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  const refreshCart = async () => {
    await loadCartItems();
  };

  const value = {
    cartItems,
    cartTotal,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};