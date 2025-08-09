import { Category } from '@/types';

// Interface for category service operations
export interface CategoryService {
  getAllCategories: () => Promise<Category[]>;
  getCategoryById: (id: number) => Promise<Category | undefined>;
  createCategory: (category: Omit<Category, 'id'>) => Promise<Category>;
  updateCategory: (id: number, category: Partial<Category>) => Promise<Category | undefined>;
  deleteCategory: (id: number) => Promise<boolean>;
  initializeCategoriesIfEmpty: (initialCategories: Category[]) => void;
}

// Implementation using localStorage
export class LocalStorageCategoryService implements CategoryService {
  private readonly STORAGE_KEY = 'delicias-categories';
  
  // Helper method to get all categories from localStorage
  private getStoredCategories(): Category[] {
    try {
      const storedCategories = localStorage.getItem(this.STORAGE_KEY);
      return storedCategories ? JSON.parse(storedCategories) : [];
    } catch (error) {
      console.error('Error reading categories from localStorage:', error);
      return [];
    }
  }
  
  // Helper method to save categories to localStorage
  private saveCategories(categories: Category[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving categories to localStorage:', error);
    }
  }
  
  // Initialize localStorage with categories from data file if empty
  public initializeCategoriesIfEmpty(initialCategories: Category[]): void {
    const currentCategories = this.getStoredCategories();
    if (currentCategories.length === 0) {
      this.saveCategories(initialCategories);
    }
  }
  
  // Get all categories
  public async getAllCategories(): Promise<Category[]> {
    return this.getStoredCategories();
  }
  
  // Get a category by its ID
  public async getCategoryById(id: number): Promise<Category | undefined> {
    const categories = this.getStoredCategories();
    return categories.find(category => category.id === id);
  }
  
  // Helper method to generate slug from name
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  }

  // Create a new category
  public async createCategory(categoryData: Omit<Category, 'id'>): Promise<Category> {
    const categories = this.getStoredCategories();
    const newId = categories.length > 0 
      ? Math.max(...categories.map(c => c.id)) + 1 
      : 1;
    
    // Auto-generate slug if not provided
    const slug = categoryData.slug || this.generateSlug(categoryData.name);
    
    const newCategory: Category = {
      id: newId,
      name: categoryData.name,
      description: categoryData.description,
      image: categoryData.image,
      slug: slug
    };
    
    categories.push(newCategory);
    this.saveCategories(categories);
    
    return newCategory;
  }
  
  // Update an existing category
  public async updateCategory(id: number, categoryUpdate: Partial<Category>): Promise<Category | undefined> {
    const categories = this.getStoredCategories();
    const index = categories.findIndex(category => category.id === id);
    
    if (index === -1) return undefined;
    
    // Auto-generate slug if name is updated but slug is not provided
    if (categoryUpdate.name && !categoryUpdate.slug) {
      categoryUpdate.slug = this.generateSlug(categoryUpdate.name);
    }
    
    const updatedCategory = {
      ...categories[index],
      ...categoryUpdate,
      id // Ensure ID doesn't change
    };
    
    categories[index] = updatedCategory;
    this.saveCategories(categories);
    
    return updatedCategory;
  }
  
  // Fix existing categories that might have missing slugs
  public async fixMissingSlugs(): Promise<void> {
    const categories = this.getStoredCategories();
    let hasChanges = false;
    
    const fixedCategories = categories.map(category => {
      if (!category.slug) {
        hasChanges = true;
        return {
          ...category,
          slug: this.generateSlug(category.name)
        };
      }
      return category;
    });
    
    if (hasChanges) {
      this.saveCategories(fixedCategories);
      console.log('Fixed categories with missing slugs');
    }
  }
  
  // Delete a category
  public async deleteCategory(id: number): Promise<boolean> {
    const categories = this.getStoredCategories();
    const initialLength = categories.length;
    
    const filteredCategories = categories.filter(category => category.id !== id);
    if (filteredCategories.length !== initialLength) {
      this.saveCategories(filteredCategories);
      return true;
    }
    
    return false;
  }
}

// Create and export a singleton instance
export const categoryService = new LocalStorageCategoryService();