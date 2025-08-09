import { Order, CartItem } from '@/types';

// Mock database of orders
let orders: Order[] = [];

// Generate order ID
const generateOrderId = (): string => {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Create a new order
export const createOrder = async (
  userId: string,
  items: CartItem[],
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  },
  paymentMethodId: string,
  subtotal: number,
  shippingCost: number,
  taxAmount: number,
  discount: number,
  paymentResult: {
    status: string;
    transactionId?: string;
    [key: string]: unknown;
  }
): Promise<Order> => {
  // CRITICAL: Only create order if payment was successful
  if (!paymentResult || paymentResult.status !== 'completed') {
    throw new Error('Cannot create order: Payment not completed. Status: ' + (paymentResult?.status || 'undefined'));
  }

  console.log('✅ Creating order after successful payment:', paymentResult.transactionId);

  const newOrder: Order = {
    id: generateOrderId(),
    userId,
    items: items.map(item => ({
      productId: item.product.id.toString(),
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      total: item.product.price * item.quantity
    })),
    status: 'paid', // Set to paid since payment is completed
    subtotal,
    shippingCost,
    taxAmount,
    discount,
    total: subtotal + shippingCost + taxAmount - discount,
    shippingAddress,
    paymentMethodId,
    paymentStatus: 'paid', // Always paid since we check above
    paymentDetails: paymentResult,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  orders = [newOrder, ...orders];
  
  // Store in localStorage for persistence
  localStorage.setItem('orders', JSON.stringify(orders));
  
  console.log('📦 Order created successfully:', newOrder.id);
  
  return newOrder;
};

// Get orders by user ID
export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  // Load from localStorage if available
  const storedOrders = localStorage.getItem('orders');
  if (storedOrders) {
    orders = JSON.parse(storedOrders);
  }
  
  return orders.filter(order => order.userId === userId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

// Get order by ID
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  // Load from localStorage if available
  const storedOrders = localStorage.getItem('orders');
  if (storedOrders) {
    orders = JSON.parse(storedOrders);
  }
  
  return orders.find(order => order.id === orderId) || null;
};

// Update order status
export const updateOrderStatus = async (
  orderId: string,
  status: Order['status']
): Promise<Order | null> => {
  const orderIndex = orders.findIndex(order => order.id === orderId);
  
  if (orderIndex === -1) {
    return null;
  }
  
  orders[orderIndex] = {
    ...orders[orderIndex],
    status,
    updatedAt: new Date().toISOString()
  };
  
  // Store in localStorage
  localStorage.setItem('orders', JSON.stringify(orders));
  
  return orders[orderIndex];
};

// Get all orders (admin only)
export const getAllOrders = async (): Promise<Order[]> => {
  // Load from localStorage if available
  const storedOrders = localStorage.getItem('orders');
  if (storedOrders) {
    orders = JSON.parse(storedOrders);
  }
  
  return orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export default {
  createOrder,
  getOrdersByUserId,
  getOrderById,
  updateOrderStatus,
  getAllOrders
};