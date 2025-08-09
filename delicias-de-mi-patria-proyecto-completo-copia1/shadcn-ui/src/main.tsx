import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize shipping options on app start
import { getStoredShippingOptions } from './lib/shipping-service';
import './data/products-data'; // Initialize products data
import './data/promotions-data'; // Initialize promotions data

// Create admin user on app load
import { createAdminUser } from './utils/create-admin';

// Initialize site content
import './lib/site-content-service';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Create admin user on app load
    if (typeof window !== 'undefined') {
      createAdminUser();
    }
  } catch (error) {
    console.error('Error initializing admin user:', error);
  }
});

// Initialize shipping options
getStoredShippingOptions();

// Fix any existing categories that might have missing slugs
import { categoryService } from '@/lib/category-service';
categoryService.fixMissingSlugs();

createRoot(document.getElementById('root')!).render(<App />);