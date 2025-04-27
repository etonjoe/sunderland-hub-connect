
import { Dispatch, SetStateAction } from 'react';
import { User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { mapSupabaseUser } from '@/lib/supabase';

export const useAuthMethods = (
  setUser: Dispatch<SetStateAction<User | null>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>
) => {
  const login = async (email: string, password: string): Promise<boolean> => {
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
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout');
    }
  };

  const register = async (email: string, password: string, metadata: any): Promise<boolean> => {
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
    try {
      const { error: authError } = await supabase.auth.updateUser({
        data: userData
      });

      if (authError) {
        console.error('Auth update error:', authError);
        toast.error(authError.message);
        return false;
      }

      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .update(userData)
          .eq('id', userData.id);

        if (profileError) {
          console.warn('Profile update warning:', profileError);
        }
      } catch (profileUpdateError) {
        console.warn('Profile table might not exist or has different structure:', profileUpdateError);
      }

      setUser(prev => prev ? { ...prev, ...userData } : null);
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('An error occurred while updating profile');
      return false;
    }
  };

  const upgradeAccount = async (): Promise<boolean> => {
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

  const resetPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const origin = window.location.origin;
      const redirectUrl = `${origin}/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      toast.success('Password reset instructions have been sent to your email');
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('An error occurred during the password reset');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    logout,
    register,
    updateProfile,
    upgradeAccount,
    resetPassword
  };
};
