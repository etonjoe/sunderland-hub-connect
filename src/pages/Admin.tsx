
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AlertCircle, Check, User, Users, FileText, MessageSquare, Activity, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Sample data
const ADMIN_USERS = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin', isPremium: true, lastLogin: '2023-05-20 10:30 AM' },
  { id: '3', name: 'Premium User', email: 'premium@example.com', role: 'user', isPremium: true, lastLogin: '2023-05-19 3:45 PM' },
  { id: '2', name: 'Regular User', email: 'user@example.com', role: 'user', isPremium: false, lastLogin: '2023-05-18 9:15 AM' },
  { id: '4', name: 'Jane Smith', email: 'jane@example.com', role: 'user', isPremium: true, lastLogin: '2023-05-17 1:20 PM' },
  { id: '5', name: 'John Doe', email: 'john@example.com', role: 'user', isPremium: false, lastLogin: '2023-05-16 11:05 AM' },
];

const RECENT_ACTIVITIES = [
  { id: '1', action: 'New forum post', user: 'Premium User', timestamp: '2023-05-20 10:30 AM', details: 'Posted in General Discussion' },
  { id: '2', action: 'Resource uploaded', user: 'Admin User', timestamp: '2023-05-19 3:45 PM', details: 'Family Tree 2023' },
  { id: '3', action: 'New member joined', user: 'John Doe', timestamp: '2023-05-18 9:15 AM', details: 'Basic membership' },
  { id: '4', action: 'Premium upgrade', user: 'Jane Smith', timestamp: '2023-05-17 1:20 PM', details: 'Yearly subscription' },
  { id: '5', action: 'New announcement', user: 'Admin User', timestamp: '2023-05-16 11:05 AM', details: 'Annual Family Reunion' },
];

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
    return (
      <div className="container py-10 animate-fade-in">
        <div className="max-w-2xl mx-auto text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-lg text-muted-foreground mb-6">
            You do not have permission to access the admin area.
            This section is restricted to administrators only.
          </p>
          <Button asChild>
            <a href="/">Return to Home</a>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Users className="mr-3 h-8 w-8" />
        Admin Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Premium Members</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">47% of members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Resources</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+5 from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="users">
            <User className="mr-2 h-4 w-4" />
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
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage users, roles, and permissions
              </CardDescription>
              <div className="mt-2">
                <Input 
                  placeholder="Search users..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'outline' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isPremium ? 'default' : 'secondary'} className={user.isPremium ? 'bg-family-orange' : ''}>
                          {user.isPremium ? 'Premium' : 'Basic'}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          {user.id !== '1' && ( // Don't show delete for admin
                            <Button variant="outline" size="sm" className="text-destructive">
                              Delete
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Previous</Button>
              <Button variant="outline">Next</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Track user actions across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {RECENT_ACTIVITIES.map(activity => (
                    <TableRow key={activity.id}>
                      <TableCell>{activity.action}</TableCell>
                      <TableCell>{activity.user}</TableCell>
                      <TableCell>{activity.details}</TableCell>
                      <TableCell>{activity.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Previous</Button>
              <Button variant="outline">Next</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>
                Manage forum posts, resources, and other content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-20 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4" />
                <p>Content management features coming soon!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="announcements">
          <Card>
            <CardHeader>
              <CardTitle>Announcement Management</CardTitle>
              <CardDescription>
                Create and manage family announcements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-20 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4" />
                <p>Announcement management features coming soon!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
