import { supabase } from './supabase';
import { Order, CartItem } from '@/types';

export interface CreateOrderData {
  userId: string;
  items: CartItem[];
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  paymentMethodId: string;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  paymentResult: {
    transactionId: string;
    status: string;
  };
}

export const createRealOrder = async (data: CreateOrderData): Promise<Order> => {
  try {
    // Start transaction by creating the order first
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: data.userId,
        status: 'confirmed',
        subtotal: data.subtotal,
        shipping_cost: data.shippingCost,
        tax_amount: data.taxAmount,
        discount_amount: data.discountAmount,
        total: data.subtotal + data.shippingCost + data.taxAmount - data.discountAmount,
        payment_method_id: data.paymentMethodId,
        payment_status: 'completed',
        payment_transaction_id: data.paymentResult.transactionId,
        shipping_address: data.shippingAddress,
      })
      .select()
      .single();

    if (orderError) {
      throw new Error(`Error creating order: ${orderError.message}`);
    }

    // Create order items
    const orderItems = data.items.map(item => ({
      order_id: orderData.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
      total: item.product.price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      throw new Error(`Error creating order items: ${itemsError.message}`);
    }

    // Fetch the complete order with items
    const { data: completeOrder, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq('id', orderData.id)
      .single();

    if (fetchError) {
      throw new Error(`Error fetching complete order: ${fetchError.message}`);
    }

    // Transform to match our Order interface
    const transformedOrder: Order = {
      id: completeOrder.id,
      userId: completeOrder.user_id,
      items: completeOrder.order_items.map((item: any) => ({
        product: {
          id: item.products.id,
          name: item.products.name,
          price: item.products.price,
          image: item.products.image,
          description: item.products.description,
          category: item.products.category,
          slug: item.products.slug,
        },
        quantity: item.quantity,
      })),
      total: completeOrder.total,
      status: completeOrder.status,
      createdAt: completeOrder.created_at,
      shippingAddress: completeOrder.shipping_address,
      paymentMethod: completeOrder.payment_method_id,
      paymentStatus: completeOrder.payment_status,
      subtotal: completeOrder.subtotal,
      shippingCost: completeOrder.shipping_cost,
      taxAmount: completeOrder.tax_amount,
      discountAmount: completeOrder.discount_amount,
    };

    console.log('✅ Real order created in Supabase:', transformedOrder.id);
    return transformedOrder;

  } catch (error) {
    console.error('❌ Error creating real order:', error);
    throw error;
  }
};

export const getRealOrdersByUserId = async (userId: string): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching orders: ${error.message}`);
    }

    return data.map((order: any): Order => ({
      id: order.id,
      userId: order.user_id,
      items: order.order_items.map((item: any) => ({
        product: {
          id: item.products.id,
          name: item.products.name,
          price: item.products.price,
          image: item.products.image,
          description: item.products.description,
          category: item.products.category,
          slug: item.products.slug,
        },
        quantity: item.quantity,
      })),
      total: order.total,
      status: order.status,
      createdAt: order.created_at,
      shippingAddress: order.shipping_address,
      paymentMethod: order.payment_method_id,
      paymentStatus: order.payment_status,
      subtotal: order.subtotal,
      shippingCost: order.shipping_cost,
      taxAmount: order.tax_amount,
      discountAmount: order.discount_amount,
    }));
  } catch (error) {
    console.error('❌ Error fetching real orders:', error);
    throw error;
  }
};

export const getAllRealOrders = async (): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        ),
        users (
          name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching all orders: ${error.message}`);
    }

    return data.map((order: any): Order => ({
      id: order.id,
      userId: order.user_id,
      customerName: order.users?.name || 'Unknown',
      customerEmail: order.users?.email || 'Unknown',
      items: order.order_items.map((item: any) => ({
        product: {
          id: item.products.id,
          name: item.products.name,
          price: item.products.price,
          image: item.products.image,
          description: item.products.description,
          category: item.products.category,
          slug: item.products.slug,
        },
        quantity: item.quantity,
      })),
      total: order.total,
      status: order.status,
      createdAt: order.created_at,
      shippingAddress: order.shipping_address,
      paymentMethod: order.payment_method_id,
      paymentStatus: order.payment_status,
      subtotal: order.subtotal,
      shippingCost: order.shipping_cost,
      taxAmount: order.tax_amount,
      discountAmount: order.discount_amount,
    }));
  } catch (error) {
    console.error('❌ Error fetching all real orders:', error);
    throw error;
  }
};

export const updateRealOrderStatus = async (orderId: string, status: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (error) {
      throw new Error(`Error updating order status: ${error.message}`);
    }

    console.log('✅ Real order status updated:', orderId, status);
  } catch (error) {
    console.error('❌ Error updating real order status:', error);
    throw error;
  }
};