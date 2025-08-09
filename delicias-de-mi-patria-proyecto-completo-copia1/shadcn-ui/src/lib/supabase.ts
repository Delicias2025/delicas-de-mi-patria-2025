import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from './supabase-config';

export const supabase = supabaseConfig.isEnabled 
  ? createClient(supabaseConfig.url, supabaseConfig.anonKey)
  : null;

export const isSupabaseEnabled = supabaseConfig.isEnabled;