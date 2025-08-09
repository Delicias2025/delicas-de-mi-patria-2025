import { supabase, CartItem, Product, getSessionId } from '../lib/supabase';

export class RealCartService {
  // =============================================
  // CART MANAGEMENT
  // =============================================

  async getCartItems(userId?: string): Promise<CartItem[]> {
    try {
      let query = supabase
        .from('cart_items')
        .select(`
          *,
          product:products(
            *,
            category:categories(*)
          )
        `);

      if (userId) {
        query = query.eq('user_id', userId);
      } else {
        const sessionId = getSessionId();
        query = query.eq('session_id', sessionId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cart items:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getCartItems:', error);
      return [];
    }
  }

  async addToCart(productId: string, quantity: number = 1, userId?: string): Promise<CartItem> {
    try {
      const sessionId = userId ? null : getSessionId();

      // Check if item already exists in cart
      let existingQuery = supabase
        .from('cart_items')
        .select('*')
        .eq('product_id', productId);

      if (userId) {
        existingQuery = existingQuery.eq('user_id', userId);
      } else {
        existingQuery = existingQuery.eq('session_id', sessionId);
      }

      const { data: existing } = await existingQuery.single();

      if (existing) {
        // Update existing item
        return await this.updateCartItemQuantity(existing.id, existing.quantity + quantity);
      } else {
        // Add new item
        const { data, error } = await supabase
          .from('cart_items')
          .insert([{
            user_id: userId || null,
            session_id: sessionId,
            product_id: productId,
            quantity,
          }])
          .select(`
            *,
            product:products(
              *,
              category:categories(*)
            )
          `)
          .single();

        if (error) {
          console.error('Error adding to cart:', error);
          throw error;
        }

        console.log('✅ Item added to cart:', data);
        return data;
      }
    } catch (error) {
      console.error('Error in addToCart:', error);
      throw error;
    }
  }

  async updateCartItemQuantity(cartItemId: string, quantity: number): Promise<CartItem> {
    try {
      if (quantity <= 0) {
        await this.removeFromCart(cartItemId);
        throw new Error('Item removed from cart');
      }

      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId)
        .select(`
          *,
          product:products(
            *,
            category:categories(*)
          )
        `)
        .single();

      if (error) {
        console.error('Error updating cart item quantity:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateCartItemQuantity:', error);
      throw error;
    }
  }

  async removeFromCart(cartItemId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) {
        console.error('Error removing from cart:', error);
        throw error;
      }

      console.log('✅ Item removed from cart');
    } catch (error) {
      console.error('Error in removeFromCart:', error);
      throw error;
    }
  }

  async clearCart(userId?: string): Promise<void> {
    try {
      let query = supabase.from('cart_items').delete();

      if (userId) {
        query = query.eq('user_id', userId);
      } else {
        const sessionId = getSessionId();
        query = query.eq('session_id', sessionId);
      }

      const { error } = await query;

      if (error) {
        console.error('Error clearing cart:', error);
        throw error;
      }

      console.log('✅ Cart cleared');
    } catch (error) {
      console.error('Error in clearCart:', error);
      throw error;
    }
  }

  async getCartTotal(userId?: string): Promise<{ subtotal: number; itemCount: number }> {
    try {
      const cartItems = await this.getCartItems(userId);
      
      const subtotal = cartItems.reduce((total, item) => {
        const price = item.product?.discount_price || item.product?.price || 0;
        return total + (price * item.quantity);
      }, 0);
      
      const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
      
      return { subtotal, itemCount };
    } catch (error) {
      console.error('Error calculating cart total:', error);
      return { subtotal: 0, itemCount: 0 };
    }
  }

  async mergeGuestCartWithUser(userId: string): Promise<void> {
    try {
      const sessionId = getSessionId();
      
      // Get guest cart items
      const { data: guestItems, error: guestError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('session_id', sessionId);

      if (guestError || !guestItems?.length) {
        return; // No guest items to merge
      }

      // Get user's existing cart items
      const { data: userItems, error: userError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId);

      if (userError) {
        console.error('Error fetching user cart:', userError);
        return;
      }

      // Merge logic
      for (const guestItem of guestItems) {
        const existingUserItem = userItems?.find(item => item.product_id === guestItem.product_id);
        
        if (existingUserItem) {
          // Update existing user item quantity
          await supabase
            .from('cart_items')
            .update({ quantity: existingUserItem.quantity + guestItem.quantity })
            .eq('id', existingUserItem.id);
        } else {
          // Convert guest item to user item
          await supabase
            .from('cart_items')
            .update({ 
              user_id: userId, 
              session_id: null 
            })
            .eq('id', guestItem.id);
        }
      }

      // Clean up any remaining guest items
      await supabase
        .from('cart_items')
        .delete()
        .eq('session_id', sessionId)
        .neq('user_id', userId);

      console.log('✅ Guest cart merged with user cart');
    } catch (error) {
      console.error('Error merging guest cart:', error);
    }
  }

  // =============================================
  // REALTIME SUBSCRIPTIONS
  // =============================================

  subscribeToCartChanges(userId: string | null, callback: (payload: any) => void) {
    if (userId) {
      return supabase
        .channel(`cart_changes_${userId}`)
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'cart_items',
          filter: `user_id=eq.${userId}`
        }, callback)
        .subscribe();
    } else {
      const sessionId = getSessionId();
      return supabase
        .channel(`cart_changes_${sessionId}`)
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'cart_items',
          filter: `session_id=eq.${sessionId}`
        }, callback)
        .subscribe();
    }
  }
}

export const realCartService = new RealCartService();