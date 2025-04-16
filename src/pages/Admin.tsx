
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AlertCircle, Check, User, Users, FileText, MessageSquare, Activity, Bell, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import StatsCard from '@/components/admin/StatsCard';
import AnalyticsChart from '@/components/admin/AnalyticsChart';
import MembershipTable from '@/components/admin/MembershipTable';
import { User as UserType, MembershipStat, ActivityStat, RevenueStat } from '@/types';

// Sample data
const ADMIN_USERS = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin', isPremium: true, lastLogin: '2023-05-20 10:30 AM', createdAt: new Date('2023-01-15') },
  { id: '3', name: 'Premium User', email: 'premium@example.com', role: 'user', isPremium: true, lastLogin: '2023-05-19 3:45 PM', createdAt: new Date('2023-02-20') },
  { id: '2', name: 'Regular User', email: 'user@example.com', role: 'user', isPremium: false, lastLogin: '2023-05-18 9:15 AM', createdAt: new Date('2023-03-10') },
  { id: '4', name: 'Jane Smith', email: 'jane@example.com', role: 'user', isPremium: true, lastLogin: '2023-05-17 1:20 PM', createdAt: new Date('2023-04-05') },
  { id: '5', name: 'John Doe', email: 'john@example.com', role: 'user', isPremium: false, lastLogin: '2023-05-16 11:05 AM', createdAt: new Date('2023-05-01') },
];

const RECENT_ACTIVITIES = [
  { id: '1', action: 'New forum post', user: 'Premium User', timestamp: '2023-05-20 10:30 AM', details: 'Posted in General Discussion' },
  { id: '2', action: 'Resource uploaded', user: 'Admin User', timestamp: '2023-05-19 3:45 PM', details: 'Family Tree 2023' },
  { id: '3', action: 'New member joined', user: 'John Doe', timestamp: '2023-05-18 9:15 AM', details: 'Basic membership' },
  { id: '4', action: 'Premium upgrade', user: 'Jane Smith', timestamp: '2023-05-17 1:20 PM', details: 'Yearly subscription' },
  { id: '5', action: 'New announcement', user: 'Admin User', timestamp: '2023-05-16 11:05 AM', details: 'Annual Family Reunion' },
];

// Sample analytics data
const MEMBERSHIP_STATS: MembershipStat[] = [
  { period: 'Jan', totalUsers: 82, premiumUsers: 24, retentionRate: 94 },
  { period: 'Feb', totalUsers: 87, premiumUsers: 27, retentionRate: 95 },
  { period: 'Mar', totalUsers: 94, premiumUsers: 32, retentionRate: 97 },
  { period: 'Apr', totalUsers: 103, premiumUsers: 41, retentionRate: 96 },
  { period: 'May', totalUsers: 115, premiumUsers: 52, retentionRate: 98 },
  { period: 'Jun', totalUsers: 124, premiumUsers: 62, retentionRate: 97 },
];

const ACTIVITY_STATS: ActivityStat[] = [
  { period: 'Jan', forumPosts: 45, resourceUploads: 12, chatMessages: 230, activeUsers: 68 },
  { period: 'Feb', forumPosts: 52, resourceUploads: 15, chatMessages: 245, activeUsers: 72 },
  { period: 'Mar', forumPosts: 61, resourceUploads: 18, chatMessages: 280, activeUsers: 79 },
  { period: 'Apr', forumPosts: 58, resourceUploads: 22, chatMessages: 310, activeUsers: 85 },
  { period: 'May', forumPosts: 72, resourceUploads: 26, chatMessages: 350, activeUsers: 94 },
  { period: 'Jun', forumPosts: 81, resourceUploads: 31, chatMessages: 420, activeUsers: 105 },
];

const REVENUE_STATS: RevenueStat[] = [
  { period: 'Jan', amount: 480, subscriptions: 8, renewals: 16 },
  { period: 'Feb', amount: 540, subscriptions: 9, renewals: 18 },
  { period: 'Mar', amount: 660, subscriptions: 11, renewals: 21 },
  { period: 'Apr', amount: 780, subscriptions: 13, renewals: 25 },
  { period: 'May', amount: 960, subscriptions: 16, renewals: 30 },
  { period: 'Jun', amount: 1140, subscriptions: 19, renewals: 35 },
];

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
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
      
      <Tabs defaultValue="dashboard">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="dashboard">
            <Activity className="mr-2 h-4 w-4" />
            Dashboard
          </TabsTrigger>
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
        
        <TabsContent value="dashboard">
          <div className="space-y-8">
            {/* Time Period Selector */}
            <div className="flex justify-end">
              <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod} className="w-[400px]">
                <TabsList>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="quarter">Quarter</TabsTrigger>
                  <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard 
                title="Total Members" 
                value="124" 
                description="15% growth this month"
                icon={<Users />}
                trend={{ value: 15, isPositive: true, description: "from last period" }}
              />
              <StatsCard 
                title="Premium Members" 
                value="62" 
                description="50% of total members"
                icon={<Check />}
                trend={{ value: 12, isPositive: true, description: "from last period" }}
              />
              <StatsCard 
                title="Monthly Revenue" 
                value="$1,140" 
                description="19 subscriptions this month"
                icon={<DollarSign />}
                trend={{ value: 18, isPositive: true, description: "from last period" }}
              />
              <StatsCard 
                title="Retention Rate" 
                value="97%" 
                description="3 cancellations this month"
                icon={<Calendar />}
                trend={{ value: 2, isPositive: true, description: "from last period" }}
              />
            </div>
            
            {/* Membership Growth Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <AnalyticsChart 
                title="Membership Growth"
                description="Total and premium members over time"
                data={MEMBERSHIP_STATS}
                type="line"
                xAxisDataKey="period"
                dataKeys={[
                  { key: "totalUsers", name: "Total Members", color: "#1E88E5" },
                  { key: "premiumUsers", name: "Premium Members", color: "#FF9800" }
                ]}
              />
              
              <StatsCard 
                title="Active Users Today" 
                value="87" 
                description="70% of total members"
                icon={<TrendingUp />}
                trend={{ value: 5, isPositive: true, description: "from yesterday" }}
              />
              <StatsCard 
                title="New Posts Today" 
                value="14" 
                description="23% increase from yesterday"
                icon={<MessageSquare />}
                trend={{ value: 23, isPositive: true, description: "from yesterday" }}
              />
              <StatsCard 
                title="New Resources" 
                value="5" 
                description="This week"
                icon={<FileText />}
                trend={{ value: 40, isPositive: true, description: "from last week" }}
              />
            </div>
            
            {/* Activity and Revenue Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnalyticsChart 
                title="User Activity"
                description="Forum posts, uploads and messages over time"
                data={ACTIVITY_STATS}
                type="bar"
                xAxisDataKey="period"
                dataKeys={[
                  { key: "forumPosts", name: "Forum Posts", color: "#1E88E5" },
                  { key: "resourceUploads", name: "Resource Uploads", color: "#43A047" },
                  { key: "chatMessages", name: "Chat Messages", color: "#FF9800" }
                ]}
              />
              
              <AnalyticsChart 
                title="Revenue"
                description="Subscription revenue and renewals"
                data={REVENUE_STATS}
                type="line"
                xAxisDataKey="period"
                dataKeys={[
                  { key: "amount", name: "Revenue ($)", color: "#43A047" },
                  { key: "subscriptions", name: "New Subscriptions", color: "#1E88E5" },
                  { key: "renewals", name: "Renewals", color: "#FF9800" }
                ]}
              />
            </div>
            
            {/* Recent Members */}
            <MembershipTable 
              title="Recent Members"
              description="New members in the last 30 days"
              users={ADMIN_USERS as UserType[]}
              onEditUser={(user) => console.log("View details for", user.name)}
            />
          </div>
        </TabsContent>
        
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
