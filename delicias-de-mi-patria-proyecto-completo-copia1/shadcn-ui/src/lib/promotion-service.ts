import { Promotion } from '@/types';

class PromotionService {
  // Get all promotions
  async getPromotions(): Promise<Promotion[]> {
    try {
      const promotionsData = localStorage.getItem('promotions');
      return promotionsData ? JSON.parse(promotionsData) : [];
    } catch (error) {
      console.error('Error getting promotions:', error);
      return [];
    }
  }

  // Get promotion by ID
  async getPromotionById(id: number): Promise<Promotion | null> {
    try {
      const promotions = await this.getPromotions();
      return promotions.find(promo => promo.id === id) || null;
    } catch (error) {
      console.error(`Error getting promotion with ID ${id}:`, error);
      return null;
    }
  }

  // Add a new promotion
  async addPromotion(promotion: Omit<Promotion, 'id'>): Promise<Promotion> {
    try {
      const promotions = await this.getPromotions();
      const newId = promotions.length > 0 ? Math.max(...promotions.map(p => p.id)) + 1 : 1;
      
      const newPromotion = {
        ...promotion,
        id: newId,
        usageCount: 0
      };
      
      const updatedPromotions = [...promotions, newPromotion];
      localStorage.setItem('promotions', JSON.stringify(updatedPromotions));
      
      return newPromotion;
    } catch (error) {
      console.error('Error adding promotion:', error);
      throw new Error('Failed to add promotion');
    }
  }

  // Update an existing promotion
  async updatePromotion(id: number, updateData: Partial<Promotion>): Promise<Promotion> {
    try {
      const promotions = await this.getPromotions();
      const index = promotions.findIndex(p => p.id === id);
      
      if (index === -1) {
        throw new Error(`Promotion with ID ${id} not found`);
      }
      
      const updatedPromotion = {
        ...promotions[index],
        ...updateData
      };
      
      promotions[index] = updatedPromotion;
      localStorage.setItem('promotions', JSON.stringify(promotions));
      
      return updatedPromotion;
    } catch (error) {
      console.error(`Error updating promotion with ID ${id}:`, error);
      throw new Error('Failed to update promotion');
    }
  }

  // Delete a promotion
  async deletePromotion(id: number): Promise<boolean> {
    try {
      const promotions = await this.getPromotions();
      const filteredPromotions = promotions.filter(p => p.id !== id);
      
      if (filteredPromotions.length === promotions.length) {
        return false; // No promotion was removed
      }
      
      localStorage.setItem('promotions', JSON.stringify(filteredPromotions));
      return true;
    } catch (error) {
      console.error(`Error deleting promotion with ID ${id}:`, error);
      return false;
    }
  }

  // Get active promotions only
  async getActivePromotions(): Promise<Promotion[]> {
    try {
      const promotions = await this.getPromotions();
      return promotions.filter(promo => promo.active);
    } catch (error) {
      console.error('Error getting active promotions:', error);
      return [];
    }
  }

  // Toggle promotion active status
  async togglePromotionStatus(id: number): Promise<Promotion> {
    try {
      const promotion = await this.getPromotionById(id);
      
      if (!promotion) {
        throw new Error(`Promotion with ID ${id} not found`);
      }
      
      return await this.updatePromotion(id, { active: !promotion.active });
    } catch (error) {
      console.error(`Error toggling status for promotion with ID ${id}:`, error);
      throw new Error('Failed to toggle promotion status');
    }
  }

  // Apply a registration promotion for new users
  async applyRegistrationPromotion(): Promise<{ promotion: Promotion, discountAmount: number } | null> {
    try {
      const activePromotions = await this.getActivePromotions();
      const registrationPromo = activePromotions.find(p => p.type === 'registration_discount');
      
      if (!registrationPromo) {
        return null;
      }

      // Update usage count
      await this.updatePromotion(registrationPromo.id, { 
        usageCount: registrationPromo.usageCount + 1 
      });
      
      // If we reached the usage limit, deactivate the promotion
      if (registrationPromo.usageLimit && registrationPromo.usageCount + 1 >= registrationPromo.usageLimit) {
        await this.updatePromotion(registrationPromo.id, { active: false });
      }
      
      return { 
        promotion: registrationPromo,
        discountAmount: registrationPromo.value
      };
    } catch (error) {
      console.error('Error applying registration promotion:', error);
      return null;
    }
  }
}

export const promotionService = new PromotionService();

// Export functions that will be used directly
export const getPromotions = async (): Promise<Promotion[]> => {
  return await promotionService.getPromotions();
};

export const createPromotion = async (promotion: Omit<Promotion, 'id'>): Promise<Promotion> => {
  return await promotionService.addPromotion(promotion);
};

export const updatePromotion = async (id: string, updateData: Partial<Promotion>): Promise<Promotion> => {
  return await promotionService.updatePromotion(Number(id), updateData);
};

export const deletePromotion = async (id: string): Promise<boolean> => {
  return await promotionService.deletePromotion(Number(id));
};