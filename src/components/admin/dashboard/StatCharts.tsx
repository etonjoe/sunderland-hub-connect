
import AnalyticsChart from '@/components/admin/AnalyticsChart';
import type { MembershipStat, ActivityStat, RevenueStat } from '@/types';

interface StatChartsProps {
  membershipStats: MembershipStat[];
  activityStats: ActivityStat[];
  revenueStats: RevenueStat[];
}

const StatCharts = ({ membershipStats, activityStats, revenueStats }: StatChartsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <AnalyticsChart 
          title="Membership Growth"
          description="Total and premium members over time"
          data={membershipStats}
          type="line"
          xAxisDataKey="period"
          dataKeys={[
            { key: "totalUsers", name: "Total Members", color: "#1E88E5" },
            { key: "premiumUsers", name: "Premium Members", color: "#FF9800" }
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart 
          title="User Activity"
          description="Forum posts, uploads and messages over time"
          data={activityStats}
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
    </>
  );
};

export default StatCharts;
