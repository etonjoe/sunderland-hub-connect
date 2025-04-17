
import { createClient } from '@supabase/supabase-js';
import { User } from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const mapSupabaseUser = (supabaseUser: any): User => ({
  id: supabaseUser.id,
  email: supabaseUser.email || '',
  name: supabaseUser.user_metadata?.name || '',
  avatar: supabaseUser.user_metadata?.avatar_url || '',
  role: supabaseUser.user_metadata?.role || 'user',
  isPremium: supabaseUser.user_metadata?.isPremium || false,
  createdAt: new Date(supabaseUser.created_at)
});
