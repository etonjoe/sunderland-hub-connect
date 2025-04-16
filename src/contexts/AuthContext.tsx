
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { toast } from 'sonner';

// Mock user data
const mockUsers = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    avatar: '',
    role: 'admin' as const,
    isPremium: true,
    createdAt: new Date()
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'user123',
    name: 'Regular User',
    avatar: '',
    role: 'user' as const,
    isPremium: false,
    createdAt: new Date()
  },
  {
    id: '3',
    email: 'premium@example.com',
    password: 'premium123',
    name: 'Premium User',
    avatar: '',
    role: 'user' as const,
    isPremium: true,
    createdAt: new Date()
  }
];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  updateProfile: (user: Partial<User>) => Promise<boolean>;
  upgradeAccount: () => Promise<boolean>;
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

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('sunderlandHubUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (!foundUser) {
        toast.error('Invalid email or password');
        return false;
      }
      
      // Remove password from user object before storing
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      
      // Save to localStorage
      localStorage.setItem('sunderlandHubUser', JSON.stringify(userWithoutPassword));
      
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sunderlandHubUser');
    toast.success('Logged out successfully');
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUser = mockUsers.find(
        u => u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (existingUser) {
        toast.error('Email is already registered');
        return false;
      }
      
      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        name,
        role: 'user' as const,
        isPremium: false,
        createdAt: new Date()
      };
      
      setUser(newUser);
      
      // Save to localStorage
      localStorage.setItem('sunderlandHubUser', JSON.stringify(newUser));
      
      toast.success('Registration successful');
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
    if (!user) return false;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Update localStorage
      localStorage.setItem('sunderlandHubUser', JSON.stringify(updatedUser));
      
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('An error occurred while updating profile');
      return false;
    }
  };

  const upgradeAccount = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // Simulate payment processing and account upgrade
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const upgradedUser = { ...user, isPremium: true };
      setUser(upgradedUser);
      
      // Update localStorage
      localStorage.setItem('sunderlandHubUser', JSON.stringify(upgradedUser));
      
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
        upgradeAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
