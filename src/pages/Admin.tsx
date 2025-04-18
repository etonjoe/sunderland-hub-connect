import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, User as UserIcon, Activity, FileText, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Import our new components
import Dashboard from './admin/Dashboard';
import UsersManagement from './admin/UsersManagement';
import ActivityLog from './admin/ActivityLog';
import ContentManagement from './admin/ContentManagement';
import AnnouncementManagement from './admin/AnnouncementManagement';
import AccessDenied from './admin/AccessDenied';
import { ADMIN_USERS } from './admin/AdminData';

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  const isAdmin = user?.role === 'admin';
  
  const filteredUsers = ADMIN_USERS.filter(u => 
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
        
        <TabsContent value="dashboard">
          <Dashboard users={ADMIN_USERS} />
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
      </Tabs>
    </div>
  );
};

export default Admin;
