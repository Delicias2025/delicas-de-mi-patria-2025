// Shipping service for managing shipping options and costs
export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// LocalStorage key for shipping options
const SHIPPING_STORAGE_KEY = 'delicias-shipping-options';

// Helper to get shipping options from localStorage
export const getStoredShippingOptions = (): ShippingOption[] => {
  try {
    const stored = localStorage.getItem(SHIPPING_STORAGE_KEY);
    if (stored) {
      const parsedOptions = JSON.parse(stored);
      console.log('📦 Shipping options from localStorage:', parsedOptions);
      return parsedOptions;
    } else {
      console.log('📦 No shipping options in localStorage, using defaults');
      const defaults = getDefaultShippingOptions();
      saveShippingOptions(defaults); // Initialize localStorage with defaults
      return defaults;
    }
  } catch (error) {
    console.error('Error reading shipping options from localStorage:', error);
    const defaults = getDefaultShippingOptions();
    saveShippingOptions(defaults);
    return defaults;
  }
};

// Helper to save shipping options to localStorage
const saveShippingOptions = (options: ShippingOption[]): void => {
  try {
    localStorage.setItem(SHIPPING_STORAGE_KEY, JSON.stringify(options));
    console.log('💾 Shipping options saved to localStorage:', options.length);
  } catch (error) {
    console.error('Error saving shipping options to localStorage:', error);
  }
};

// Default shipping options
const getDefaultShippingOptions = (): ShippingOption[] => [
  {
    id: "standard",
    name: "Envío Estándar",
    description: "Entrega en 5-7 días hábiles",
    price: 0,
    estimatedDays: "5-7 días",
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "express",
    name: "Envío Express",
    description: "Entrega en 2-3 días hábiles",
    price: 15.99,
    estimatedDays: "2-3 días",
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "overnight",
    name: "Envío Nocturno",
    description: "Entrega al siguiente día hábil",
    price: 29.99,
    estimatedDays: "1 día",
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Get all active shipping options for customers
export const getActiveShippingOptions = async (): Promise<ShippingOption[]> => {
  const options = getStoredShippingOptions();
  return options.filter(option => option.active);
};

// Get all shipping options (admin only)
export const getAllShippingOptions = async (): Promise<ShippingOption[]> => {
  return [...getStoredShippingOptions()];
};

// Get shipping option by ID
export const getShippingOptionById = async (id: string): Promise<ShippingOption | null> => {
  const options = getStoredShippingOptions();
  const option = options.find(option => option.id === id);
  return option || null;
};

// Create a new shipping option
export const createShippingOption = async (
  name: string,
  description: string,
  price: number,
  estimatedDays: string
): Promise<ShippingOption> => {
  const newOption: ShippingOption = {
    id: `shipping-${Date.now()}`,
    name,
    description,
    price,
    estimatedDays,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const options = getStoredShippingOptions();
  const updatedOptions = [...options, newOption];
  saveShippingOptions(updatedOptions);
  
  return newOption;
};

// Update a shipping option
export const updateShippingOption = async (
  id: string,
  updates: Partial<Omit<ShippingOption, "id" | "createdAt">>
): Promise<ShippingOption | null> => {
  console.log('🚚 updateShippingOption called:', { id, updates });
  
  const options = getStoredShippingOptions();
  const optionIndex = options.findIndex(option => option.id === id);
  
  if (optionIndex === -1) {
    console.log('❌ Shipping option not found:', id);
    return null;
  }
  
  const updatedOption = {
    ...options[optionIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  console.log('✅ Updated shipping option:', JSON.stringify(updatedOption, null, 2));
  
  const updatedOptions = [
    ...options.slice(0, optionIndex),
    updatedOption,
    ...options.slice(optionIndex + 1)
  ];
  
  saveShippingOptions(updatedOptions);
  
  return updatedOption;
};

// Delete a shipping option
export const deleteShippingOption = async (id: string): Promise<boolean> => {
  const options = getStoredShippingOptions();
  const initialLength = options.length;
  const filteredOptions = options.filter(option => option.id !== id);
  
  if (filteredOptions.length !== initialLength) {
    saveShippingOptions(filteredOptions);
    return true;
  }
  
  return false;
};

// Calculate shipping cost based on selected option and location
export const calculateShippingCost = async (
  shippingOptionId: string,
  state?: string,
  weight?: number
): Promise<number> => {
  const option = await getShippingOptionById(shippingOptionId);
  
  if (!option) {
    return 0;
  }
  
  let cost = option.price;
  
  // Add location-based adjustments if needed
  if (state && (state === 'Hawaii' || state === 'Alaska')) {
    cost += 10; // Additional cost for remote locations
  }
  
  // Add weight-based adjustments if needed
  if (weight && weight > 10) {
    cost += Math.floor((weight - 10) / 5) * 5; // $5 for every 5 lbs over 10 lbs
  }
  
  return cost;
};

// Export the service
export const shippingService = {
  getActiveShippingOptions,
  getAllShippingOptions,
  getShippingOptionById,
  createShippingOption,
  updateShippingOption,
  deleteShippingOption,
  calculateShippingCost
};

export default shippingService;