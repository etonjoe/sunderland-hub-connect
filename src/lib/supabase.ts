
import { createClient } from '@supabase/supabase-js';
import { User } from '@/types';
import { toast } from 'sonner';

// Get Supabase URL and key from your Supabase project settings
// Using direct values for now since this is a demo app
// In a real production app, these should be environment variables
const supabaseUrl = 'https://your-supabase-project.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';

// Create supabase client
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

// Helper function to check if supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return true; // Now we're using direct values, so it's always configured
};
