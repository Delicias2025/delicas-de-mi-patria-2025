import { supabase, ContactMessage } from '../lib/supabase';

export class RealContactService {
  
  // =============================================
  // CONTACT MESSAGE MANAGEMENT
  // =============================================
  
  async submitContactMessage(messageData: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
  }): Promise<ContactMessage> {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([{
          name: messageData.name,
          email: messageData.email,
          phone: messageData.phone,
          subject: messageData.subject,
          message: messageData.message,
          is_read: false,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error submitting contact message:', error);
        throw error;
      }

      console.log('✅ Contact message submitted:', data);
      return data;
    } catch (error) {
      console.error('Error in submitContactMessage:', error);
      throw error;
    }
  }

  async getAllMessages(): Promise<ContactMessage[]> {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contact messages:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllMessages:', error);
      return [];
    }
  }

  async getUnreadMessages(): Promise<ContactMessage[]> {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching unread messages:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUnreadMessages:', error);
      return [];
    }
  }

  async markMessageAsRead(messageId: string): Promise<ContactMessage> {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .update({ is_read: true })
        .eq('id', messageId)
        .select()
        .single();

      if (error) {
        console.error('Error marking message as read:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in markMessageAsRead:', error);
      throw error;
    }
  }

  async markMessageAsReplied(messageId: string): Promise<ContactMessage> {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .update({ 
          is_read: true,
          replied_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .select()
        .single();

      if (error) {
        console.error('Error marking message as replied:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in markMessageAsReplied:', error);
      throw error;
    }
  }

  async deleteMessage(messageId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', messageId);

      if (error) {
        console.error('Error deleting message:', error);
        throw error;
      }

      console.log('✅ Contact message deleted');
    } catch (error) {
      console.error('Error in deleteMessage:', error);
      throw error;
    }
  }

  async getMessageStats(): Promise<{
    total_messages: number;
    unread_messages: number;
    today_messages: number;
  }> {
    try {
      const { data: messages, error } = await supabase
        .from('contact_messages')
        .select('is_read, created_at');

      if (error) throw error;

      const today = new Date().toISOString().split('T')[0];
      const todayMessages = messages?.filter(message => 
        message.created_at.startsWith(today)
      ) || [];

      return {
        total_messages: messages?.length || 0,
        unread_messages: messages?.filter(message => !message.is_read).length || 0,
        today_messages: todayMessages.length,
      };
    } catch (error) {
      console.error('Error getting message stats:', error);
      return {
        total_messages: 0,
        unread_messages: 0,
        today_messages: 0,
      };
    }
  }

  // =============================================
  // REALTIME SUBSCRIPTIONS
  // =============================================

  subscribeToMessages(callback: (payload: any) => void) {
    return supabase
      .channel('contact_messages_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, callback)
      .subscribe();
  }
}

export const realContactService = new RealContactService();