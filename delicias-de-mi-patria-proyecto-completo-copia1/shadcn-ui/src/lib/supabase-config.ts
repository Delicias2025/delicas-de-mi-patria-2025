import { createClient } from '@supabase/supabase-js';

// Supabase configuration with environment variables
export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL || '',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  isEnabled: !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
};

console.log('Supabase config:', {
  url: supabaseConfig.url ? 'Set' : 'Missing',
  anonKey: supabaseConfig.anonKey ? 'Set' : 'Missing',
  isEnabled: supabaseConfig.isEnabled
});

// Create Supabase client
export const supabase = supabaseConfig.isEnabled 
  ? createClient(supabaseConfig.url, supabaseConfig.anonKey)
  : null;

// Fallback client for development
if (!supabase) {
  console.warn('Supabase not configured. Using localStorage fallback.');
}