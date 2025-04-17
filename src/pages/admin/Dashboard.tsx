import { useState } from 'react';
import { Activity, Users, Calendar, DollarSign, MessageSquare, FileText, TrendingUp } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsCard from '@/components/admin/StatsCard';
import AnalyticsChart from '@/components/admin/AnalyticsChart';
import MembershipTable from '@/components/admin/MembershipTable';
import { UserType, MembershipStat, ActivityStat, RevenueStat } from '@/types/admin';

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

interface DashboardProps {
  users: any[];
}

const Dashboard = ({ users }: DashboardProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  return (
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
          icon={<Users />}
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
        users={users as UserType[]}
        onEditUser={(user) => console.log("View details for", user.name)}
      />
    </div>
  );
};

export default Dashboard;
