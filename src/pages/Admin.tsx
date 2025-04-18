
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, User as UserIcon, Activity, FileText, Bell, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

// Import our new components
import Dashboard from './admin/Dashboard';
import UsersManagement from './admin/UsersManagement';
import ActivityLog from './admin/ActivityLog';
import ContentManagement from './admin/ContentManagement';
import AnnouncementManagement from './admin/AnnouncementManagement';
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
        // Test the connection to Supabase
        const { data, error } = await supabase.from('profiles').select('*').limit(10);
        
        if (error) {
          console.error('Supabase connection error:', error);
          toast.error('Failed to connect to the database');
          setHasError(true);
        } else {
          console.log('Successfully connected to Supabase:', data);
          // We'll still use the demo data for now
          setUsers(ADMIN_USERS);
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
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
        <TabsList className="grid w-full grid-cols-5 mb-6">
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
          </>
        )}
      </Tabs>
    </div>
  );
};

export default Admin;
