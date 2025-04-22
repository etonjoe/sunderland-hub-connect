
import { TrendingUp, MessageSquare, FileText } from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import type { ActivityStat } from '@/types';

interface ActivityMetricsProps {
  activityStats: ActivityStat[];
}

const ActivityMetrics = ({ activityStats }: ActivityMetricsProps) => {
  const latestStats = activityStats[activityStats.length - 1];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <StatsCard 
        title="Active Users Today" 
        value={latestStats?.activeUsers.toString() || "0"}
        description="70% of total members"
        icon={<TrendingUp />}
        trend={{ value: 5, isPositive: true, description: "from yesterday" }}
      />
      <StatsCard 
        title="New Posts Today" 
        value={latestStats?.forumPosts.toString() || "0"}
        description="23% increase from yesterday"
        icon={<MessageSquare />}
        trend={{ value: 23, isPositive: true, description: "from yesterday" }}
      />
      <StatsCard 
        title="New Resources" 
        value={latestStats?.resourceUploads.toString() || "0"}
        description="This week"
        icon={<FileText />}
        trend={{ value: 40, isPositive: true, description: "from last week" }}
      />
    </div>
  );
};

export default ActivityMetrics;
