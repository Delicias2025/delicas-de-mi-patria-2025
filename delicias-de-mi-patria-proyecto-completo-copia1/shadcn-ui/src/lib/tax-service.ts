import { useState } from 'react';

// Base tax rates by state (simplified for this implementation)
const STATE_TAX_RATES: Record<string, number> = {
  // United States
  'Alabama': 0.04,
  'Alaska': 0.00,
  'Arizona': 0.056,
  'Arkansas': 0.065,
  'California': 0.0725,
  'Colorado': 0.029,
  'Connecticut': 0.0635,
  'Delaware': 0.00,
  'Florida': 0.06,
  'Georgia': 0.04,
  'Hawaii': 0.04,
  'Idaho': 0.06,
  'Illinois': 0.0625,
  'Indiana': 0.07,
  'Iowa': 0.06,
  'Kansas': 0.065,
  'Kentucky': 0.06,
  'Louisiana': 0.0445,
  'Maine': 0.055,
  'Maryland': 0.06,
  'Massachusetts': 0.0625,
  'Michigan': 0.06,
  'Minnesota': 0.06875,
  'Mississippi': 0.07,
  'Missouri': 0.04225,
  'Montana': 0.00,
  'Nebraska': 0.055,
  'Nevada': 0.0685,
  'New Hampshire': 0.00,
  'New Jersey': 0.06625,
  'New Mexico': 0.05125,
  'New York': 0.04,
  'North Carolina': 0.0475,
  'North Dakota': 0.05,
  'Ohio': 0.0575,
  'Oklahoma': 0.045,
  'Oregon': 0.00,
  'Pennsylvania': 0.06,
  'Rhode Island': 0.07,
  'South Carolina': 0.06,
  'South Dakota': 0.045,
  'Tennessee': 0.07,
  'Texas': 0.0625,
  'Utah': 0.0485,
  'Vermont': 0.06,
  'Virginia': 0.053,
  'Washington': 0.065,
  'West Virginia': 0.06,
  'Wisconsin': 0.05,
  'Wyoming': 0.04,
  'District of Columbia': 0.06,

  // Mexican States
  'Aguascalientes': 0.16,
  'Baja California': 0.16,
  'Baja California Sur': 0.16,
  'Campeche': 0.16,
  'Chiapas': 0.16,
  'Chihuahua': 0.16,
  'Coahuila': 0.16,
  'Colima': 0.16,
  'Durango': 0.16,
  'Estado de México': 0.16,
  'Guanajuato': 0.16,
  'Guerrero': 0.16,
  'Hidalgo': 0.16,
  'Jalisco': 0.16,
  'Michoacán': 0.16,
  'Morelos': 0.16,
  'Nayarit': 0.16,
  'Nuevo León': 0.16,
  'Oaxaca': 0.16,
  'Puebla': 0.16,
  'Querétaro': 0.16,
  'Quintana Roo': 0.16,
  'San Luis Potosí': 0.16,
  'Sinaloa': 0.16,
  'Sonora': 0.16,
  'Tabasco': 0.16,
  'Tamaulipas': 0.16,
  'Tlaxcala': 0.16,
  'Veracruz': 0.16,
  'Yucatán': 0.16,
  'Zacatecas': 0.16,
  'Ciudad de México': 0.16,

  // Spanish regions
  'Andalucía': 0.21,
  'Aragón': 0.21,
  'Asturias': 0.21,
  'Islas Baleares': 0.21,
  'Canarias': 0.07, // Special tax zone
  'Cantabria': 0.21,
  'Castilla-La Mancha': 0.21,
  'Castilla y León': 0.21,
  'Cataluña': 0.21,
  'Extremadura': 0.21,
  'Galicia': 0.21,
  'La Rioja': 0.21,
  'Madrid': 0.21,
  'Murcia': 0.21,
  'Navarra': 0.21,
  'País Vasco': 0.21,
  'Valencia': 0.21,
  'Ceuta': 0.10, // Special tax zone
  'Melilla': 0.10  // Special tax zone
};

// Default tax rate if state is not found
const DEFAULT_TAX_RATE = 0.10;

// Calculate tax based on state and amount
export const calculateTax = (state: string, amount: number): number => {
  // Get the tax rate for the specified state, or use default rate
  const normalizedState = state.trim();
  const taxRate = STATE_TAX_RATES[normalizedState] !== undefined ? 
    STATE_TAX_RATES[normalizedState] : DEFAULT_TAX_RATE;
  
  // Calculate the tax amount
  return amount * taxRate;
};

// Get the tax rate for a specific state
export const getTaxRate = (state: string): number => {
  const normalizedState = state.trim();
  return STATE_TAX_RATES[normalizedState] !== undefined ? 
    STATE_TAX_RATES[normalizedState] : DEFAULT_TAX_RATE;
};

// Format tax rate as percentage
export const formatTaxRate = (rate: number): string => {
  return `${(rate * 100).toFixed(2)}%`;
};

// Get list of available states with their tax rates
export const getAvailableStates = (): Array<{state: string, rate: number}> => {
  return Object.entries(STATE_TAX_RATES).map(([state, rate]) => ({
    state,
    rate
  }));
};

// Check if tax exemption applies
export const isTaxExempt = (productCategory: string): boolean => {
  const exemptCategories = ['Comida Básica', 'Medicamentos', 'Libros Educativos'];
  return exemptCategories.includes(productCategory);
};

// Use this hook in React components
export const useTaxCalculator = () => {
  const [selectedState, setSelectedState] = useState<string>('');
  
  const calculateTaxForState = (amount: number): number => {
    return calculateTax(selectedState, amount);
  };
  
  return {
    selectedState,
    setSelectedState,
    calculateTaxForState,
    getTaxRate: () => getTaxRate(selectedState),
    formatTaxRate: () => formatTaxRate(getTaxRate(selectedState))
  };
};

export const taxService = {
  calculateTax,
  getTaxRate,
  formatTaxRate,
  getAvailableStates,
  isTaxExempt
};

export default taxService;