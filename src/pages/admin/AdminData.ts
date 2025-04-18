
import { User } from '@/types';

// Sample data for admin dashboard with correct types
export const ADMIN_USERS: User[] = [
  { 
    id: '1', 
    name: 'Admin User', 
    email: 'admin@example.com', 
    role: 'admin', 
    isPremium: true, 
    createdAt: new Date('2023-01-15'),
  },
  { 
    id: '3', 
    name: 'Premium User', 
    email: 'premium@example.com', 
    role: 'user', 
    isPremium: true, 
    createdAt: new Date('2023-02-20'),
  },
  { 
    id: '2', 
    name: 'Regular User', 
    email: 'user@example.com', 
    role: 'user', 
    isPremium: false, 
    createdAt: new Date('2023-03-10'),
  },
  { 
    id: '4', 
    name: 'Jane Smith', 
    email: 'jane@example.com', 
    role: 'user', 
    isPremium: true, 
    createdAt: new Date('2023-04-05'),
  },
  { 
    id: '5', 
    name: 'John Doe', 
    email: 'john@example.com', 
    role: 'user', 
    isPremium: false, 
    createdAt: new Date('2023-05-01'),
  },
];
