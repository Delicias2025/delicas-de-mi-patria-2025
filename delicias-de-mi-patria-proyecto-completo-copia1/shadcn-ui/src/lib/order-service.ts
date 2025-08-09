import { Order, ShippingAddress } from "@/types";

// Mock database of orders
let orders: Order[] = [
  {
    id: "1",
    userId: "1",
    items: [
      {
        product: {
          id: "1",
          name: "Alfajores Argentinos",
          description: "Deliciosos alfajores rellenos de dulce de leche",
          price: 5.99,
          category: "Dulces",
          categoryId: "1",
          image: "/images/products/alfajores.jpg",
          stock: 50
        },
        quantity: 2
      },
      {
        product: {
          id: "2",
          name: "Café Colombiano Premium",
          description: "Café de origen colombiano, tostado medio",
          price: 12.50,
          category: "Bebidas",
          categoryId: "2",
          image: "/images/Coffee.jpg",
          stock: 30
        },
        quantity: 1
      }
    ],
    total: 24.48,
    status: "completed",
    shippingAddress: {
      fullName: "María Rodríguez",
      address: "Calle Principal 123",
      city: "Madrid",
      postalCode: "28001",
      country: "España",
      phone: "+34 600 123 456"
    },
    paymentMethod: "Tarjeta de crédito",
    createdAt: "2025-08-01T10:30:00Z"
  },
  {
    id: "2",
    userId: "2",
    items: [
      {
        product: {
          id: "3",
          name: "Tortillas de Maíz",
          description: "Tortillas de maíz tradicionales mexicanas",
          price: 3.99,
          category: "Productos Básicos",
          categoryId: "3",
          image: "/images/products/tortillas.jpg",
          stock: 100
        },
        quantity: 3
      }
    ],
    total: 11.97,
    status: "processing",
    shippingAddress: {
      fullName: "Juan Pérez",
      address: "Avenida Central 456",
      city: "Barcelona",
      postalCode: "08001",
      country: "España",
      phone: "+34 600 789 012"
    },
    paymentMethod: "PayPal",
    createdAt: "2025-08-02T09:15:00Z"
  }
];

// Get all orders
export const getAllOrders = async (): Promise<Order[]> => {
  // In a real app, this would fetch from database
  return [...orders];
};

// Get order by ID
export const getOrderById = async (id: string): Promise<Order | null> => {
  // In a real app, this would fetch from database
  const order = orders.find(order => order.id === id);
  return order || null;
};

// Get orders by user ID
export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  // In a real app, this would fetch from database
  return orders.filter(order => order.userId === userId);
};

// Create a new order
export const createOrder = async (
  userId: string | null,
  items: Order['items'],
  total: number,
  shippingAddress: ShippingAddress,
  paymentMethod: string
): Promise<Order> => {
  // In a real app, this would save to database
  const newOrder: Order = {
    id: String(orders.length + 1),
    userId,
    items,
    total,
    status: "pending",
    shippingAddress,
    paymentMethod,
    createdAt: new Date().toISOString()
  };
  
  orders = [...orders, newOrder];
  
  // Notify of new order (in a real app, this would use a notification service)
  notifyNewOrder(newOrder);
  
  return newOrder;
};

// Update order status
export const updateOrderStatus = async (
  id: string,
  status: Order['status'],
  trackingNumber?: string
): Promise<Order | null> => {
  // In a real app, this would update in database
  const orderIndex = orders.findIndex(order => order.id === id);
  
  if (orderIndex === -1) {
    return null;
  }
  
  const updatedOrder = {
    ...orders[orderIndex],
    status
  };
  
  // Add shipped date and tracking number if status is shipped
  if (status === 'shipped') {
    updatedOrder.shippedAt = new Date().toISOString();
    if (trackingNumber) {
      updatedOrder.trackingNumber = trackingNumber;
    }
  }
  
  orders = [
    ...orders.slice(0, orderIndex),
    updatedOrder,
    ...orders.slice(orderIndex + 1)
  ];
  
  return updatedOrder;
};

// Delete an order
export const deleteOrder = async (id: string): Promise<boolean> => {
  // In a real app, this would delete from database or mark as deleted
  const initialLength = orders.length;
  orders = orders.filter(order => order.id !== id);
  
  return orders.length !== initialLength;
};

// Notify of new order
export const notifyNewOrder = (order: Order): void => {
  // In a real app, this would trigger notifications
  console.log(`New order received: Order ID ${order.id}`);
  
  // Here you would implement your notification logic:
  // - Email notifications
  // - Push notifications
  // - SMS notifications
  // - In-app notifications
  
  // For now, we'll just expose a global event that the admin UI can listen to
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('newOrder', { detail: order });
    window.dispatchEvent(event);
  }
};

// For demonstration, expose the orders object
export const orderService = {
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  notifyNewOrder
};

export default orderService;