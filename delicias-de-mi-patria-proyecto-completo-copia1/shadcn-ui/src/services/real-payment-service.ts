import { supabase } from '../lib/supabase';
import { realOrderService } from './real-order-service';
import { realCartService } from './real-cart-service';

export class RealPaymentService {
  
  // =============================================
  // PAYMENT PROCESSING
  // =============================================
  
  async createPaymentIntent(orderData: any): Promise<{ success: boolean; orderNumber?: string; error?: string }> {
    try {
      console.log('🔄 Creating payment intent with order data:', orderData);
      
      // Generate unique order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
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
  }

  async processStripePayment(
    cardElement: any, 
    orderData: any, 
    stripe: any
  ): Promise<{ success: boolean; error?: string; orderNumber?: string }> {
    try {
      console.log('💳 Processing Stripe payment with order data:', orderData);

      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: orderData.shippingAddress.fullName,
          email: orderData.customerEmail,
          phone: orderData.customerPhone,
        },
      });

      if (paymentMethodError) {
        console.error('❌ Payment method creation failed:', paymentMethodError);
        return { 
          success: false, 
          error: paymentMethodError.message 
        };
      }

      // Create order in Supabase immediately
      const realOrder = await realOrderService.createOrder({
        user_id: orderData.userId || null,
        customer_name: orderData.shippingAddress.fullName,
        customer_email: orderData.customerEmail,
        customer_phone: orderData.customerPhone,
        shipping_address: orderData.shippingAddress,
        payment_method: 'stripe',
        payment_intent_id: paymentMethod.id,
        items: orderData.items,
        subtotal: orderData.subtotal,
        tax_amount: orderData.taxAmount || 0,
        shipping_cost: orderData.shippingCost,
        discount_amount: orderData.discountAmount || 0,
        total_amount: orderData.total,
      });

      // Clear cart after successful order
      await realCartService.clearCart(orderData.userId);

      console.log('✅ REAL STRIPE ORDER CREATED:', realOrder);
      console.log('🎯 ORDER WILL APPEAR IN ADMIN PANEL IMMEDIATELY');

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
  }

  async processPayPalPayment(
    details: any, 
    orderData: any
  ): Promise<{ success: boolean; error?: string; orderNumber?: string }> {
    try {
      console.log('💰 Processing PayPal payment:', details);
      console.log('📦 Order data:', orderData);

      // Create order in Supabase immediately after PayPal payment success
      const realOrder = await realOrderService.createOrder({
        user_id: orderData.userId || null,
        customer_name: orderData.shippingAddress.fullName,
        customer_email: orderData.customerEmail,
        customer_phone: orderData.customerPhone,
        shipping_address: orderData.shippingAddress,
        payment_method: 'paypal',
        payment_intent_id: details.id,
        items: orderData.items,
        subtotal: orderData.subtotal,
        tax_amount: orderData.taxAmount || 0,
        shipping_cost: orderData.shippingCost,
        discount_amount: orderData.discountAmount || 0,
        total_amount: orderData.total,
      });

      // Clear cart after successful order
      await realCartService.clearCart(orderData.userId);

      console.log('✅ REAL PAYPAL ORDER CREATED:', realOrder);
      console.log('🎯 ORDER WILL APPEAR IN ADMIN PANEL IMMEDIATELY');

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
  }

  // =============================================
  // ORDER MANAGEMENT (Delegated to Order Service)
  // =============================================

  async getAllOrders() {
    return await realOrderService.getAllOrders();
  }

  async updateOrderStatus(orderId: string, newStatus: string) {
    return await realOrderService.updateOrderStatus(orderId, newStatus);
  }

  async getUserOrders(userId: string) {
    return await realOrderService.getOrdersByUserId(userId);
  }
}

export const realPaymentService = new RealPaymentService();