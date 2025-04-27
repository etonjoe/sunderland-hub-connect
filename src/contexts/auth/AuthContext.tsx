
import React, { createContext, useContext } from 'react';
import { User } from '@/types';
import { useAuthState } from './useAuthState';
import { useAuthMethods } from './useAuthMethods';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, metadata: any) => Promise<boolean>;
  updateProfile: (user: Partial<User>) => Promise<boolean>;
  upgradeAccount: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
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
  const { user, isLoading, setUser, setIsLoading, supabaseConfigured } = useAuthState();
  const { login, logout, register, updateProfile, upgradeAccount, resetPassword } = useAuthMethods(setUser, setIsLoading);

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
        resetPassword,
        supabaseConfigured
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
