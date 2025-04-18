
import { createClient } from '@supabase/supabase-js';
import { User } from '@/types';
import { toast } from 'sonner';

const supabaseUrl = 'https://gpbwlvooyvqsjuytykgo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwYndsdm9veXZxc2p1eXR5a2dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MzMwOTUsImV4cCI6MjA2MDUwOTA5NX0.aMhpjRQHqQ79YaKPXWFgxrxKOrogje8i35jL6mf01OQ';

// Create supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});

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
  return supabaseUrl.length > 0 && supabaseAnonKey.length > 0;
};

// Test connection function
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Exception during Supabase connection test:', err);
    return false;
  }
};
