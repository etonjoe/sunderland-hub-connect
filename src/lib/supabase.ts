
import { createClient } from '@supabase/supabase-js';
import { User } from '@/types';
import { toast } from 'sonner';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing. Make sure to:');
  console.error('1. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your project');
  console.error('2. Make sure your Supabase connection is properly set up');
}

// Create supabase client with fallback to prevent app from crashing
// Note: This will allow the app to load but auth won't work without proper values
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export const mapSupabaseUser = (supabaseUser: any): User => ({
  id: supabaseUser.id,
  email: supabaseUser.email || '',
  name: supabaseUser.user_metadata?.name || '',
  avatar: supabaseUser.user_metadata?.avatar_url || '',
  role: supabaseUser.user_metadata?.role || 'user',
  isPremium: supabaseUser.user_metadata?.isPremium || false,
  createdAt: new Date(supabaseUser.created_at)
});

// Helper function to check if supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!supabaseUrl && !!supabaseAnonKey && 
    supabaseUrl !== 'https://placeholder-url.supabase.co' && 
    supabaseAnonKey !== 'placeholder-key';
};
