
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, User as UserIcon, Activity, FileText, Bell, AlertCircle, Flag, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

// Import components
import Dashboard from './admin/Dashboard';
import UsersManagement from './admin/UsersManagement';
import ActivityLog from './admin/ActivityLog';
import ContentManagement from './admin/ContentManagement';
import AnnouncementManagement from './admin/AnnouncementManagement';
import ReportsManagement from './admin/ReportsManagement';
import AccessDenied from './admin/AccessDenied';
import { ADMIN_USERS } from './admin/AdminData';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [users, setUsers] = useState(ADMIN_USERS);
  
  const isAdmin = user?.role === 'admin';
  
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setHasError(false);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, role, is_premium');
        
        if (error) {
          console.error('Supabase users fetch error:', error);
          toast.error('Failed to retrieve users');
          setHasError(true);
        } else {
          const userList = (data || []).map(profile => ({
            ...profile,
            email: profile.name, // Note: This is a placeholder. You'll need to get emails from auth.users
            lastLogin: 'Not available',
            isPremium: profile.is_premium
          }));
          setUsers(userList);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        toast.error('Failed to retrieve users data');
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleUserAdded = () => {
    // Refresh users list after adding a new user
    fetchUsers();
  };
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <AccessDenied />;
  }
  
  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Users className="mr-3 h-8 w-8" />
        Admin Dashboard
      </h1>
      
      {hasError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            There was an error connecting to the database. Please try refreshing the page or contact support.
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="dashboard">
        <TabsList className="grid w-full grid-cols-7 mb-6">
          <TabsTrigger value="dashboard">
            <Activity className="mr-2 h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="users">
            <UserIcon className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Activity className="mr-2 h-4 w-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="content">
            <FileText className="mr-2 h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="announcements">
            <Bell className="mr-2 h-4 w-4" />
            Announcements
          </TabsTrigger>
          <TabsTrigger value="reports">
            <Flag className="mr-2 h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="teams">
            <Users className="mr-2 h-4 w-4" />
            Teams
          </TabsTrigger>
        </TabsList>
        
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-[200px] w-full rounded-md" />
            <div className="grid grid-cols-4 gap-4">
              <Skeleton className="h-[100px] w-full rounded-md" />
              <Skeleton className="h-[100px] w-full rounded-md" />
              <Skeleton className="h-[100px] w-full rounded-md" />
              <Skeleton className="h-[100px] w-full rounded-md" />
            </div>
            <Skeleton className="h-[400px] w-full rounded-md" />
          </div>
        ) : (
          <>
            <TabsContent value="dashboard">
              <Dashboard users={users} />
            </TabsContent>
            
            <TabsContent value="users">
              <UsersManagement 
                users={filteredUsers}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onUserAdded={handleUserAdded}
              />
            </TabsContent>
            
            <TabsContent value="activity">
              <ActivityLog />
            </TabsContent>
            
            <TabsContent value="content">
              <ContentManagement />
            </TabsContent>
            
            <TabsContent value="announcements">
              <AnnouncementManagement />
            </TabsContent>

            <TabsContent value="reports">
              <ReportsManagement />
            </TabsContent>

            <TabsContent value="teams">
              {/* TODO: Add Teams Management Component */}
              <div className="text-center py-12 text-muted-foreground">
                Teams management coming soon
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default Admin;
