
import { useState } from 'react';
import { Activity, Users, Calendar, DollarSign, MessageSquare, FileText, TrendingUp } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsCard from '@/components/admin/StatsCard';
import AnalyticsChart from '@/components/admin/AnalyticsChart';
import MembershipTable from '@/components/admin/MembershipTable';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserType, MembershipStat, ActivityStat, RevenueStat } from '@/types';
import { toast } from 'sonner';

interface DashboardProps {
  users: UserType[];
}

const Dashboard = ({ users }: DashboardProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const { data: membershipStats = [], isError: isMembershipError } = useQuery({
    queryKey: ['membershipStats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('membership_stats')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) {
        toast.error('Failed to fetch membership statistics');
        throw error;
      }
      
      return data as MembershipStat[];
    }
  });

  const { data: activityStats = [], isError: isActivityError } = useQuery({
    queryKey: ['activityStats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_stats')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) {
        toast.error('Failed to fetch activity statistics');
        throw error;
      }
      
      return data as ActivityStat[];
    }
  });

  const { data: revenueStats = [], isError: isRevenueError } = useQuery({
    queryKey: ['revenueStats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('revenue_stats')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) {
        toast.error('Failed to fetch revenue statistics');
        throw error;
      }
      
      return data as RevenueStat[];
    }
  });

  if (isMembershipError || isActivityError || isRevenueError) {
    toast.error('Error loading dashboard data');
  }

  const latestStats = membershipStats[membershipStats.length - 1] || {
    total_users: 0,
    premium_users: 0,
    retention_rate: 0
  };

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
          value={latestStats.total_users.toString()}
          description={`${((latestStats.total_users / (membershipStats[membershipStats.length - 2]?.total_users || 1) - 1) * 100).toFixed(0)}% growth this month`}
          icon={<Users />}
          trend={{ 
            value: 15, 
            isPositive: true, 
            description: "from last period" 
          }}
        />
        <StatsCard 
          title="Premium Members" 
          value={latestStats.premium_users.toString()}
          description={`${((latestStats.premium_users / latestStats.total_users) * 100).toFixed(0)}% of total members`}
          icon={<Users />}
          trend={{ 
            value: 12, 
            isPositive: true, 
            description: "from last period" 
          }}
        />
        <StatsCard 
          title="Monthly Revenue" 
          value={`$${revenueStats[revenueStats.length - 1]?.amount || 0}`}
          description={`${revenueStats[revenueStats.length - 1]?.subscriptions || 0} subscriptions this month`}
          icon={<DollarSign />}
          trend={{ 
            value: 18, 
            isPositive: true, 
            description: "from last period" 
          }}
        />
        <StatsCard 
          title="Retention Rate" 
          value={`${latestStats.retention_rate}%`}
          description="3 cancellations this month"
          icon={<Calendar />}
          trend={{ 
            value: 2, 
            isPositive: true, 
            description: "from last period" 
          }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <AnalyticsChart 
          title="Membership Growth"
          description="Total and premium members over time"
          data={membershipStats}
          type="line"
          xAxisDataKey="period"
          dataKeys={[
            { key: "total_users", name: "Total Members", color: "#1E88E5" },
            { key: "premium_users", name: "Premium Members", color: "#FF9800" }
          ]}
        />

        <StatsCard 
          title="Active Users Today" 
          value={activityStats[activityStats.length - 1]?.active_users.toString() || "0"}
          description="70% of total members"
          icon={<TrendingUp />}
          trend={{ value: 5, isPositive: true, description: "from yesterday" }}
        />
        <StatsCard 
          title="New Posts Today" 
          value={activityStats[activityStats.length - 1]?.forum_posts.toString() || "0"}
          description="23% increase from yesterday"
          icon={<MessageSquare />}
          trend={{ value: 23, isPositive: true, description: "from yesterday" }}
        />
        <StatsCard 
          title="New Resources" 
          value={activityStats[activityStats.length - 1]?.resource_uploads.toString() || "0"}
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
          data={activityStats}
          type="bar"
          xAxisDataKey="period"
          dataKeys={[
            { key: "forum_posts", name: "Forum Posts", color: "#1E88E5" },
            { key: "resource_uploads", name: "Resource Uploads", color: "#43A047" },
            { key: "chat_messages", name: "Chat Messages", color: "#FF9800" }
          ]}
        />

        <AnalyticsChart 
          title="Revenue"
          description="Subscription revenue and renewals"
          data={revenueStats}
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
        users={users}
        onEditUser={(user) => console.log("View details for", user.name)}
      />
    </div>
  );
};

export default Dashboard;
