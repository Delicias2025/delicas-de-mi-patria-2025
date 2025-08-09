import { createContext, useContext, useReducer, ReactNode, useState, useEffect } from 'react';
import { CartItem, Product, ShippingMethod } from '@/types';
import { shippingOptions } from '@/data/products';

type CartState = {
  items: CartItem[];
  shippingMethod: ShippingMethod;
};

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; quantity: number }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_SHIPPING_METHOD'; method: ShippingMethod };

type CartContextType = {
  cart: CartState;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setShippingMethod: (method: ShippingMethod) => void;
  updateShippingOptions?: (options: Array<{id: string, name: string, price: number}>) => void;
  subtotal: number;
  shippingCost: number;
  total: number;
};

const initialState: CartState = {
  items: [],
  shippingMethod: 'standard',
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        (item) => item.product.id === action.product.id
      );

      if (existingItemIndex !== -1) {
        // Item already exists, update quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.quantity,
        };
        return { ...state, items: updatedItems };
      } else {
        // Add new item
        return {
          ...state,
          items: [...state.items, { product: action.product, quantity: action.quantity }],
        };
      }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== action.productId),
      };
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map((item) =>
        item.product.id === action.productId
          ? { ...item, quantity: action.quantity }
          : item
      );
      return { ...state, items: updatedItems };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'SET_SHIPPING_METHOD':
      return { ...state, shippingMethod: action.method };
    default:
      return state;
  }
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (product: Product, quantity: number) => {
    dispatch({ type: 'ADD_ITEM', product, quantity });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const setShippingMethod = (method: ShippingMethod) => {
    dispatch({ type: 'SET_SHIPPING_METHOD', method });
  };

  const updateShippingOptions = (options: Array<{id: string, name: string, price: number}>) => {
    // This function helps sync dynamic shipping prices with cart context
    console.log('🚢 Updated shipping options in cart context:', options);
    setDynamicOptions(options);
  };

  // Calculate totals
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Get shipping cost from dynamic options first, then fallback to static
  const [dynamicOptions, setDynamicOptions] = useState<Array<{id: string, name: string, price: number}>>([]);
  
  useEffect(() => {
    const loadShipping = async () => {
      try {
        const { getActiveShippingOptions } = await import('@/lib/shipping-service');
        const options = await getActiveShippingOptions();
        setDynamicOptions(options);
        console.log('🚢 Cart context loaded shipping options:', options);
      } catch (error) {
        console.error('Failed to load shipping options:', error);
      }
    };
    
    loadShipping();
    
    // Listen for shipping options updates
    const handleShippingUpdate = () => {
      console.log('🔄 Refreshing shipping options in cart context...');
      loadShipping();
    };
    
    window.addEventListener('shippingOptionsUpdated', handleShippingUpdate);
    return () => window.removeEventListener('shippingOptionsUpdated', handleShippingUpdate);
  }, []);

  const dynamicShippingOption = dynamicOptions.find(option => option.id === cart.shippingMethod);
  const staticShippingOption = shippingOptions.find(option => option.id === cart.shippingMethod);
  const shippingCost = dynamicShippingOption?.price ?? staticShippingOption?.price ?? 0;
  
  const total = subtotal + shippingCost;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setShippingMethod,
        updateShippingOptions,
        subtotal,
        shippingCost,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};