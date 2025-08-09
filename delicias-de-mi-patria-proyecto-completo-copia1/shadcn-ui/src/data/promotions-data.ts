import { Promotion } from '@/types';
import { promotionService } from '@/lib/promotion-service';

// Initial promotions data
const initialPromotions: Promotion[] = [
  {
    id: 1,
    name: "Descuento de Registro",
    description: "Descuento de $1 USD por registrarte en nuestra tienda",
    type: "registration_discount",
    value: 1,
    active: true,
    usageLimit: 100,
    usageCount: 0
  },
  {
    id: 2,
    name: "Envío gratis",
    description: "Envío gratis en compras mayores a $50 USD",
    type: "shipping_discount",
    value: 5,
    active: true,
    minimumPurchase: 50,
    usageCount: 0
  }
];

// Function to initialize promotions if they don't exist
export const initPromotions = async (): Promise<void> => {
  try {
    // Check if promotions already exist
    const existingPromotions = await promotionService.getPromotions();
    
    if (existingPromotions.length === 0) {
      // If no promotions exist, initialize with default data
      localStorage.setItem('promotions', JSON.stringify(initialPromotions));
      console.log('Promotions initialized with default data');
    }
  } catch (error) {
    console.error('Error initializing promotions:', error);
  }
};

// Initialize promotions when this module is imported
initPromotions();