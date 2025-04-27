
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { isSupabaseConfigured, mapSupabaseUser } from '@/lib/supabase';
import { toast } from 'sonner';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabaseConfigured = isSupabaseConfigured();
  
  useEffect(() => {
    if (!supabaseConfigured) {
      console.warn('Supabase is not configured correctly. Authentication features will not work.');
      toast.error('Authentication is not available. Supabase configuration is missing.');
      setIsLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const mappedUser = mapSupabaseUser(session.user);
        setUser(mappedUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const mappedUser = mapSupabaseUser(session.user);
        setUser(mappedUser);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabaseConfigured]);

  return {
    user,
    isLoading,
    setUser,
    setIsLoading,
    supabaseConfigured
  };
};
