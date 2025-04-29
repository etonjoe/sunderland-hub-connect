
import { useState } from 'react';
import { toast } from 'sonner';
import { useAdminStats } from '@/hooks/useAdminStats';
import TimeFilter from '@/components/admin/dashboard/TimeFilter';
import KeyMetrics from '@/components/admin/dashboard/KeyMetrics';
import ActivityMetrics from '@/components/admin/dashboard/ActivityMetrics';
import StatCharts from '@/components/admin/dashboard/StatCharts';
import MembershipTable from '@/components/admin/MembershipTable';
import { Badge } from '@/components/ui/badge';
import { Wifi } from 'lucide-react';
import type { User } from '@/types';

interface DashboardProps {
  users: User[];
}

const Dashboard = ({ users }: DashboardProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const { membershipStats, activityStats, revenueStats, isError } = useAdminStats();

  if (isError) {
    toast.error('Error loading dashboard data');
  }

  const latestStats = membershipStats[membershipStats.length - 1] || {
    totalUsers: 0,
    premiumUsers: 0,
    retentionRate: 0
  };
  
  const previousStats = membershipStats[membershipStats.length - 2] || {
    totalUsers: 1
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <TimeFilter 
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
        <Badge variant="secondary" className="flex items-center gap-1">
          <Wifi className="h-3 w-3" />
          <span>Real-time updates enabled</span>
        </Badge>
      </div>
      
      <KeyMetrics
        currentStats={latestStats}
        previousStats={previousStats}
        revenueStats={revenueStats}
      />

      <StatCharts
        membershipStats={membershipStats}
        activityStats={activityStats}
        revenueStats={revenueStats}
      />

      <ActivityMetrics activityStats={activityStats} />

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
