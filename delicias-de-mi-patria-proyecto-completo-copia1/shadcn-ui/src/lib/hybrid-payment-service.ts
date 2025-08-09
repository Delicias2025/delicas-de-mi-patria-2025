import { supabase } from './supabase-config';
import { createRealOrder, getAllRealOrders, updateRealOrderStatus, getRealOrdersByUserId } from './supabase-orders-service';
import { Order, CartItem } from '@/types';

export interface PaymentData {
  stripeData?: any;
  paypalData?: any;
  orderData: any;
}

class HybridPaymentService {
  private pendingOrders = new Map<string, any>();

  async createPaymentIntent(orderData: any): Promise<{ success: boolean; orderNumber?: string; error?: string }> {
    try {
      console.log('🔄 Creating payment intent with order data:', orderData);
      
      // Generate unique order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Store the order data temporarily for later completion
      this.pendingOrders.set(orderNumber, orderData);
      
      return {
        success: true,
        orderNumber
      };
    } catch (error) {
      console.error('❌ Error creating payment intent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  },

  async processStripePayment(cardElement: any, orderData: any, stripe: any): Promise<{ success: boolean; error?: string; orderNumber?: string }> {
    try {
      console.log('💳 Processing Stripe payment with order data:', orderData);

      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: orderData.shippingAddress.fullName,
          email: orderData.customerEmail || 'customer@example.com',
          address: {
            line1: orderData.shippingAddress.address,
            city: orderData.shippingAddress.city,
            postal_code: orderData.shippingAddress.postalCode,
            country: orderData.shippingAddress.country,
          },
        },
      });

      if (paymentMethodError) {
        throw new Error(`Payment method error: ${paymentMethodError.message}`);
      }

      console.log('✅ Payment method created successfully:', paymentMethod.id);

      // For demo purposes, we'll simulate a successful payment
      // In production, you would create a PaymentIntent on your server
      const mockPaymentResult = {
        id: `pi_mock_${Date.now()}`,
        status: 'succeeded',
        amount: Math.round(orderData.total * 100), // Convert to cents
        currency: 'usd',
      };

      console.log('💰 Simulated payment result:', mockPaymentResult);

      // Create order in database immediately after payment success
      const realOrder = await createRealOrder({
        userId: orderData.userId || 'guest-user',
        items: orderData.items,
        shippingAddress: orderData.shippingAddress,
        paymentMethodId: paymentMethod.id,
        subtotal: orderData.subtotal,
        shippingCost: orderData.shippingCost,
        taxAmount: orderData.taxAmount,
        discountAmount: orderData.discountAmount || 0,
        paymentResult: {
          transactionId: mockPaymentResult.id,
          status: mockPaymentResult.status,
        },
      });

      console.log('✅ REAL ORDER CREATED IN SUPABASE:', realOrder);
      console.log('🎯 ORDER WILL NOW APPEAR IN ADMIN PANEL');

      return { 
        success: true, 
        orderNumber: realOrder.id 
      };
    } catch (error) {
      console.error('❌ Stripe payment processing error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Payment processing failed' 
      };
    }
  },

  async processPayPalPayment(details: any, orderData: any): Promise<{ success: boolean; error?: string; orderNumber?: string }> {
    try {
      console.log('💰 Processing PayPal payment:', details);
      console.log('📦 Order data:', orderData);

      // Create order in database immediately after PayPal payment success
      const realOrder = await createRealOrder({
        userId: orderData.userId || 'guest-user',
        items: orderData.items,
        shippingAddress: orderData.shippingAddress,
        paymentMethodId: 'paypal',
        subtotal: orderData.subtotal,
        shippingCost: orderData.shippingCost,
        taxAmount: orderData.taxAmount,
        discountAmount: orderData.discountAmount || 0,
        paymentResult: {
          transactionId: details.id,
          status: details.status,
        },
      });

      console.log('✅ REAL PAYPAL ORDER CREATED IN SUPABASE:', realOrder);
      console.log('🎯 ORDER WILL NOW APPEAR IN ADMIN PANEL');

      return { 
        success: true,
        orderNumber: realOrder.id 
      };
    } catch (error) {
      console.error('❌ PayPal payment processing error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'PayPal payment processing failed' 
      };
    }
  },

  async getAllOrders(): Promise<Order[]> {
    try {
      console.log('🔍 Fetching all orders from Supabase...');
      
      if (supabase) {
        const realOrders = await getAllRealOrders();
        console.log('📊 Real orders fetched:', realOrders.length);
        return realOrders;
      }
      
      // Fallback to localStorage if Supabase not available
      const localOrders = localStorage.getItem('orders');
      return localOrders ? JSON.parse(localOrders) : [];
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      return [];
    }
  },

  async updateOrderStatus(orderId: string, newStatus: string): Promise<Order | null> {
    try {
      console.log(`🔄 Updating order ${orderId} to status: ${newStatus}`);
      
      if (supabase) {
        await updateRealOrderStatus(orderId, newStatus);
        
        // Fetch updated order
        const orders = await getAllRealOrders();
        const updatedOrder = orders.find(order => order.id === orderId);
        
        console.log('✅ Order status updated in Supabase');
        return updatedOrder || null;
      }
      
      // Fallback to localStorage
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = orders.map((order: any) => 
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      return updatedOrders.find((order: any) => order.id === orderId) || null;
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      return null;
    }
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    try {
      if (supabase) {
        return await getRealOrdersByUserId(userId);
      }
      
      // Fallback to localStorage
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      return orders.filter((order: any) => order.userId === userId);
    } catch (error) {
      console.error('❌ Error fetching user orders:', error);
      return [];
    }
  }
}

export const hybridPaymentService = new HybridPaymentService();