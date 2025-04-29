
import { useState, useEffect } from 'react';
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
  
  // Add a subtle highlight effect when stats change
  const [highlight, setHighlight] = useState({
    totalUsers: false,
    premiumUsers: false,
    revenue: false,
    retention: false
  });
  
  // Previous values to detect changes
  const [prevValues, setPrevValues] = useState({
    totalUsers: currentStats.totalUsers,
    premiumUsers: currentStats.premiumUsers,
    revenue: latestRevenue?.amount || 0,
    retention: currentStats.retentionRate
  });
  
  useEffect(() => {
    // Check for changes and trigger highlight effect
    if (prevValues.totalUsers !== currentStats.totalUsers) {
      setHighlight(prev => ({ ...prev, totalUsers: true }));
      setTimeout(() => setHighlight(prev => ({ ...prev, totalUsers: false })), 1500);
    }
    
    if (prevValues.premiumUsers !== currentStats.premiumUsers) {
      setHighlight(prev => ({ ...prev, premiumUsers: true }));
      setTimeout(() => setHighlight(prev => ({ ...prev, premiumUsers: false })), 1500);
    }
    
    if (prevValues.revenue !== (latestRevenue?.amount || 0)) {
      setHighlight(prev => ({ ...prev, revenue: true }));
      setTimeout(() => setHighlight(prev => ({ ...prev, revenue: false })), 1500);
    }
    
    if (prevValues.retention !== currentStats.retentionRate) {
      setHighlight(prev => ({ ...prev, retention: true }));
      setTimeout(() => setHighlight(prev => ({ ...prev, retention: false })), 1500);
    }
    
    // Update previous values
    setPrevValues({
      totalUsers: currentStats.totalUsers,
      premiumUsers: currentStats.premiumUsers,
      revenue: latestRevenue?.amount || 0,
      retention: currentStats.retentionRate
    });
  }, [currentStats, latestRevenue]);

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
        highlight={highlight.totalUsers}
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
        highlight={highlight.premiumUsers}
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
        highlight={highlight.revenue}
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
        highlight={highlight.retention}
      />
    </div>
  );
};

export default KeyMetrics;
