import { Order, OrderItem } from '@/types';
import { orderService } from './order-service';

export interface CreateOrderData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: any;
  billingAddress?: any;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  notes?: string;
}

// Simulate Stripe API for real payment processing
export const realOrderService = {
  async createPaymentIntent(orderData: CreateOrderData) {
    try {
      // For now, we'll use a mock Stripe API endpoint
      // In production, this would call your actual Stripe backend
      const response = await fetch(`https://api.stripe.com/v1/payment_intents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY}`,
        },
        body: new URLSearchParams({
          amount: Math.round(orderData.total * 100).toString(),
          currency: 'usd',
          'metadata[orderNumber]': orderData.orderNumber,
          'metadata[customerEmail]': orderData.customerEmail,
        })
      });

      // Since we can't actually call Stripe API from frontend, we'll simulate it
      // and create the order locally for testing
      const clientSecret = `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`;
      const paymentIntentId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create order locally (will be replaced with Supabase when available)
      const order = await orderService.createOrder({
        ...orderData,
        paymentMethod: 'stripe',
        paymentStatus: 'pending',
        stripePaymentIntentId: paymentIntentId
      });

      return {
        clientSecret,
        orderId: order.id,
        orderNumber: order.orderNumber,
        paymentIntentId
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  },

  async confirmPayment(paymentIntentId: string) {
    try {
      // Simulate payment confirmation
      console.log('Confirming payment for:', paymentIntentId);
      
      // Update order status locally (will be replaced with Supabase when available)
      const orders = orderService.getAllOrders();
      const order = orders.find(o => o.stripePaymentIntentId === paymentIntentId);
      
      if (order) {
        await orderService.updateOrderStatus(order.id, 'processing');
        // Also update payment status if the order service supports it
        const updatedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const orderIndex = updatedOrders.findIndex((o: any) => o.id === order.id);
        if (orderIndex !== -1) {
          updatedOrders[orderIndex].paymentStatus = 'completed';
          localStorage.setItem('orders', JSON.stringify(updatedOrders));
        }
      }

      return {
        success: true,
        order: order,
        paymentStatus: 'succeeded'
      };
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  },

  // Delegate to existing order service for CRUD operations
  async getAllOrders(): Promise<Order[]> {
    return orderService.getAllOrders();
  },

  async getOrder(id: string): Promise<Order | null> {
    return orderService.getOrder(id);
  },

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    return orderService.updateOrderStatus(id, status);
  },

  async deleteOrder(id: string): Promise<void> {
    return orderService.deleteOrder(id);
  }
};