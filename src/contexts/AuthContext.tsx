
/**
 * This is a barrel file that re-exports the AuthContext from its new location.
 * This allows existing imports from '@/contexts/AuthContext' to continue working
 * without having to update every file in the project.
 */

export { useAuth, AuthProvider } from './auth/AuthContext';
