import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { toast } from 'sonner';
import { supabase, mapSupabaseUser, isSupabaseConfigured } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, metadata: any) => Promise<boolean>;
  updateProfile: (user: Partial<User>) => Promise<boolean>;
  upgradeAccount: () => Promise<boolean>;
  supabaseConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const mappedUser = mapSupabaseUser(session.user);
        setUser(mappedUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    // Check current session
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

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!supabaseConfigured) {
      toast.error('Authentication is not available. Supabase configuration is missing.');
      return false;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      toast.success('Logged in successfully');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (!supabaseConfigured) {
      toast.error('Authentication is not available. Supabase configuration is missing.');
      return;
    }

    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout');
    }
  };

  const register = async (email: string, password: string, metadata: any): Promise<boolean> => {
    if (!supabaseConfigured) {
      toast.error('Authentication is not available. Supabase configuration is missing.');
      return false;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      toast.success('Registration successful. Please check your email for verification.');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred during registration');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!supabaseConfigured) {
      toast.error('Authentication is not available. Supabase configuration is missing.');
      return false;
    }

    if (!user) return false;
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: userData
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('An error occurred while updating profile');
      return false;
    }
  };

  const upgradeAccount = async (): Promise<boolean> => {
    if (!supabaseConfigured) {
      toast.error('Authentication is not available. Supabase configuration is missing.');
      return false;
    }

    if (!user) return false;
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          isPremium: true
        }
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Account upgraded to premium successfully');
      return true;
    } catch (error) {
      console.error('Upgrade account error:', error);
      toast.error('An error occurred during payment processing');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        updateProfile,
        upgradeAccount,
        supabaseConfigured
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
