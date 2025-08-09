import { supabase, SiteSetting } from '../lib/supabase';

export class RealSettingsService {
  
  // =============================================
  // SITE SETTINGS MANAGEMENT
  // =============================================
  
  async getAllSettings(): Promise<SiteSetting[]> {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('category', { ascending: true });

      if (error) {
        console.error('Error fetching site settings:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllSettings:', error);
      return [];
    }
  }

  async getSettingsByCategory(category: string): Promise<SiteSetting[]> {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('category', category)
        .order('key', { ascending: true });

      if (error) {
        console.error('Error fetching settings by category:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getSettingsByCategory:', error);
      return [];
    }
  }

  async getSettingByKey(key: string): Promise<SiteSetting | null> {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', key)
        .single();

      if (error) {
        console.error('Error fetching setting by key:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getSettingByKey:', error);
      return null;
    }
  }

  async updateSetting(key: string, value: string): Promise<SiteSetting> {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .update({ value })
        .eq('key', key)
        .select()
        .single();

      if (error) {
        console.error('Error updating setting:', error);
        throw error;
      }

      console.log('✅ Setting updated:', data);
      return data;
    } catch (error) {
      console.error('Error in updateSetting:', error);
      throw error;
    }
  }

  async createSetting(settingData: {
    key: string;
    value?: string;
    type?: string;
    category?: string;
    description?: string;
  }): Promise<SiteSetting> {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .insert([{
          key: settingData.key,
          value: settingData.value,
          type: settingData.type || 'text',
          category: settingData.category || 'general',
          description: settingData.description,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating setting:', error);
        throw error;
      }

      console.log('✅ Setting created:', data);
      return data;
    } catch (error) {
      console.error('Error in createSetting:', error);
      throw error;
    }
  }

  async deleteSetting(key: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('site_settings')
        .delete()
        .eq('key', key);

      if (error) {
        console.error('Error deleting setting:', error);
        throw error;
      }

      console.log('✅ Setting deleted');
    } catch (error) {
      console.error('Error in deleteSetting:', error);
      throw error;
    }
  }

  // =============================================
  // HELPER METHODS
  // =============================================

  async getSettingsAsObject(category?: string): Promise<Record<string, string>> {
    try {
      let settings: SiteSetting[];
      
      if (category) {
        settings = await this.getSettingsByCategory(category);
      } else {
        settings = await this.getAllSettings();
      }

      const settingsObject: Record<string, string> = {};
      settings.forEach(setting => {
        settingsObject[setting.key] = setting.value || '';
      });

      return settingsObject;
    } catch (error) {
      console.error('Error converting settings to object:', error);
      return {};
    }
  }

  async updateMultipleSettings(updates: Record<string, string>): Promise<void> {
    try {
      const promises = Object.entries(updates).map(([key, value]) => 
        this.updateSetting(key, value)
      );
      
      await Promise.all(promises);
      console.log('✅ Multiple settings updated');
    } catch (error) {
      console.error('Error updating multiple settings:', error);
      throw error;
    }
  }

  // =============================================
  // REALTIME SUBSCRIPTIONS
  // =============================================

  subscribeToSettings(callback: (payload: any) => void) {
    return supabase
      .channel('site_settings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, callback)
      .subscribe();
  }
}

export const realSettingsService = new RealSettingsService();