import { supabase, Order, OrderItem } from '../lib/supabase';

export class RealOrderService {
  // =============================================
  // ORDER MANAGEMENT
  // =============================================

  async createOrder(orderData: {
    user_id?: string;
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    shipping_address: any;
    payment_method: string;
    payment_intent_id?: string;
    items: Array<{
      product_id: string;
      product_name: string;
      product_image?: string;
      quantity: number;
      unit_price: number;
    }>;
    subtotal: number;
    tax_amount?: number;
    shipping_cost: number;
    discount_amount?: number;
    total_amount: number;
  }): Promise<Order> {
    try {
      // Generate unique order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: orderData.user_id || null,
          order_number: orderNumber,
          status: 'pending',
          payment_status: 'completed',
          payment_method: orderData.payment_method,
          payment_intent_id: orderData.payment_intent_id,
          customer_name: orderData.customer_name,
          customer_email: orderData.customer_email,
          customer_phone: orderData.customer_phone,
          shipping_address: orderData.shipping_address,
          subtotal: orderData.subtotal,
          tax_amount: orderData.tax_amount || 0,
          shipping_cost: orderData.shipping_cost,
          discount_amount: orderData.discount_amount || 0,
          total_amount: orderData.total_amount,
        }])
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        throw orderError;
      }

      // Create order items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_image: item.product_image,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        // If items creation fails, delete the order
        await supabase.from('orders').delete().eq('id', order.id);
        throw itemsError;
      }

      // Update product stock
      for (const item of orderData.items) {
        await this.updateProductStock(item.product_id, -item.quantity);
      }

      console.log('✅ REAL ORDER CREATED:', order);
      return order;
    } catch (error) {
      console.error('❌ Error in createOrder:', error);
      throw error;
    }
  }

  async getAllOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items:order_items(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }

    return data || [];
  }

  async getOrderById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items:order_items(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }

    return data;
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items:order_items(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }

    return data || [];
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        status,
        shipped_at: status === 'shipped' ? new Date().toISOString() : undefined,
        delivered_at: status === 'delivered' ? new Date().toISOString() : undefined
      })
      .eq('id', orderId)
      .select(`
        *,
        order_items:order_items(*)
      `)
      .single();

    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }

    return data;
  }

  async addTrackingNumber(orderId: string, trackingNumber: string): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        tracking_number: trackingNumber,
        status: 'shipped',
        shipped_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select(`
        *,
        order_items:order_items(*)
      `)
      .single();

    if (error) {
      console.error('Error adding tracking number:', error);
      throw error;
    }

    return data;
  }

  async getOrderStats(): Promise<{
    total_orders: number;
    pending_orders: number;
    completed_orders: number;
    total_revenue: number;
    today_orders: number;
    today_revenue: number;
  }> {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('status, total_amount, created_at');

      if (error) throw error;

      const today = new Date().toISOString().split('T')[0];
      const todayOrders = orders?.filter(order => 
        order.created_at.startsWith(today)
      ) || [];

      return {
        total_orders: orders?.length || 0,
        pending_orders: orders?.filter(order => order.status === 'pending').length || 0,
        completed_orders: orders?.filter(order => order.status === 'completed' || order.status === 'delivered').length || 0,
        total_revenue: orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0,
        today_orders: todayOrders.length,
        today_revenue: todayOrders.reduce((sum, order) => sum + order.total_amount, 0),
      };
    } catch (error) {
      console.error('Error getting order stats:', error);
      return {
        total_orders: 0,
        pending_orders: 0,
        completed_orders: 0,
        total_revenue: 0,
        today_orders: 0,
        today_revenue: 0,
      };
    }
  }

  // =============================================
  // HELPER METHODS
  // =============================================

  private async updateProductStock(productId: string, quantityChange: number): Promise<void> {
    try {
      // Get current stock
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('stock_quantity')
        .eq('id', productId)
        .single();

      if (fetchError || !product) {
        console.error('Error fetching product for stock update:', fetchError);
        return;
      }

      // Update stock
      const newStock = Math.max(0, product.stock_quantity + quantityChange);
      
      const { error: updateError } = await supabase
        .from('products')
        .update({ stock_quantity: newStock })
        .eq('id', productId);

      if (updateError) {
        console.error('Error updating product stock:', updateError);
      } else {
        console.log(`📦 Stock updated for product ${productId}: ${product.stock_quantity} → ${newStock}`);
      }
    } catch (error) {
      console.error('Error in updateProductStock:', error);
    }
  }

  // =============================================
  // REALTIME SUBSCRIPTIONS
  // =============================================

  subscribeToOrders(callback: (payload: any) => void) {
    return supabase
      .channel('orders_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, callback)
      .subscribe();
  }

  subscribeToOrderItems(callback: (payload: any) => void) {
    return supabase
      .channel('order_items_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'order_items' }, callback)
      .subscribe();
  }
}

export const realOrderService = new RealOrderService();