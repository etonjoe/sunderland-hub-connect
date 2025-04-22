
import { Users, Calendar, DollarSign } from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import type { MembershipStat, RevenueStat } from '@/types';

interface KeyMetricsProps {
  currentStats: {
    totalUsers: number;
    premiumUsers: number;
    retentionRate: number;
  };
  previousStats: {
    totalUsers: number;
  };
  revenueStats: RevenueStat[];
}

const KeyMetrics = ({ currentStats, previousStats, revenueStats }: KeyMetricsProps) => {
  const latestRevenue = revenueStats[revenueStats.length - 1];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard 
        title="Total Members" 
        value={currentStats.totalUsers.toString()}
        description={`${((currentStats.totalUsers / previousStats.totalUsers - 1) * 100).toFixed(0)}% growth this month`}
        icon={<Users />}
        trend={{ 
          value: 15, 
          isPositive: true, 
          description: "from last period" 
        }}
      />
      <StatsCard 
        title="Premium Members" 
        value={currentStats.premiumUsers.toString()}
        description={`${((currentStats.premiumUsers / currentStats.totalUsers) * 100).toFixed(0)}% of total members`}
        icon={<Users />}
        trend={{ 
          value: 12, 
          isPositive: true, 
          description: "from last period" 
        }}
      />
      <StatsCard 
        title="Monthly Revenue" 
        value={`$${latestRevenue?.amount || 0}`}
        description={`${latestRevenue?.subscriptions || 0} subscriptions this month`}
        icon={<DollarSign />}
        trend={{ 
          value: 18, 
          isPositive: true, 
          description: "from last period" 
        }}
      />
      <StatsCard 
        title="Retention Rate" 
        value={`${currentStats.retentionRate}%`}
        description="3 cancellations this month"
        icon={<Calendar />}
        trend={{ 
          value: 2, 
          isPositive: true, 
          description: "from last period" 
        }}
      />
    </div>
  );
};

export default KeyMetrics;
