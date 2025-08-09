import { Product } from '@/types';

// Interface for product service operations
export interface ProductService {
  getAllProducts: () => Promise<Product[]>;
  getProductById: (id: number) => Promise<Product | undefined>;
  createProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<Product | undefined>;
  deleteProduct: (id: number) => Promise<boolean>;
  getProductsByCategory: (categoryId: number) => Promise<Product[]>;
  initializeProductsIfEmpty: (initialProducts: Product[]) => void;
}

// Implementation using localStorage
export class LocalStorageProductService implements ProductService {
  private readonly STORAGE_KEY = 'delicias-products';
  
  // Helper method to get all products from localStorage
  private getStoredProducts(): Product[] {
    try {
      const storedProducts = localStorage.getItem(this.STORAGE_KEY);
      return storedProducts ? JSON.parse(storedProducts) : [];
    } catch (error) {
      console.error('Error reading products from localStorage:', error);
      return [];
    }
  }
  
  // Helper method to save products to localStorage
  private saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('Error saving products to localStorage:', error);
    }
  }
  
  // Initialize localStorage with products from data file if empty
  public initializeProductsIfEmpty(initialProducts: Product[]): void {
    const currentProducts = this.getStoredProducts();
    if (currentProducts.length === 0) {
      this.saveProducts(initialProducts);
    }
  }
  
  // Get all products
  public async getAllProducts(): Promise<Product[]> {
    return this.getStoredProducts();
  }
  
  // Get a product by its ID
  public async getProductById(id: number): Promise<Product | undefined> {
    const products = this.getStoredProducts();
    return products.find(product => product.id === id);
  }
  
  // Create a new product
  public async createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    const products = this.getStoredProducts();
    const newId = products.length > 0 
      ? Math.max(...products.map(p => p.id)) + 1 
      : 1;
    
    const newProduct: Product = {
      id: newId,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      image: productData.image,
      categoryId: productData.categoryId,
      stock: productData.stock,
      rating: productData.rating || 0,
      featured: productData.featured || false
    };
    
    products.push(newProduct);
    this.saveProducts(products);
    
    return newProduct;
  }
  
  // Update an existing product
  public async updateProduct(id: number, productUpdate: Partial<Product>): Promise<Product | undefined> {
    console.log('🔧 updateProduct called with ID:', id);
    console.log('🔧 Product update data:', JSON.stringify(productUpdate, null, 2));
    
    const products = this.getStoredProducts();
    console.log('📦 Current products before update:', products.length);
    
    const index = products.findIndex(product => product.id === id);
    console.log('🔍 Product index found:', index);
    
    if (index === -1) {
      console.log('❌ Product not found for update');
      return undefined;
    }
    
    const originalProduct = products[index];
    console.log('📋 Original product:', JSON.stringify(originalProduct, null, 2));
    
    const updatedProduct = {
      ...originalProduct,
      ...productUpdate,
      id // Ensure ID doesn't change
    };
    
    console.log('✅ Updated product:', JSON.stringify(updatedProduct, null, 2));
    
    products[index] = updatedProduct;
    this.saveProducts(products);
    
    // Verify the save worked
    const verifyProducts = this.getStoredProducts();
    const verifyProduct = verifyProducts.find(p => p.id === id);
    console.log('🔍 Verification - saved product:', JSON.stringify(verifyProduct, null, 2));
    
    // Additional verification: check localStorage directly
    const storageCheck = localStorage.getItem(this.STORAGE_KEY);
    if (storageCheck) {
      const parsedProducts = JSON.parse(storageCheck);
      const storageProduct = parsedProducts.find((p: Product) => p.id === id);
      console.log('💾 Direct localStorage check:', JSON.stringify(storageProduct, null, 2));
    }
    
    return updatedProduct;
  }
  
  // Delete a product
  public async deleteProduct(id: number): Promise<boolean> {
    const products = this.getStoredProducts();
    const initialLength = products.length;
    
    const filteredProducts = products.filter(product => product.id !== id);
    if (filteredProducts.length !== initialLength) {
      this.saveProducts(filteredProducts);
      return true;
    }
    
    return false;
  }
  
  // Get products by category
  public async getProductsByCategory(categoryId: number): Promise<Product[]> {
    const products = this.getStoredProducts();
    return products.filter(product => product.categoryId === categoryId);
  }
}

// Create and export a singleton instance
export const productService = new LocalStorageProductService();