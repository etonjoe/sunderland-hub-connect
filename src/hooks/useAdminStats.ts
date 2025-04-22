
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { MembershipStat, ActivityStat, RevenueStat } from '@/types';
import { toast } from 'sonner';

export function useAdminStats() {
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
      
      return data.map(item => ({
        id: item.id,
        period: item.period,
        totalUsers: item.total_users,
        premiumUsers: item.premium_users,
        retentionRate: item.retention_rate,
        createdAt: new Date(item.created_at)
      })) as MembershipStat[];
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
      
      return data.map(item => ({
        id: item.id,
        period: item.period,
        forumPosts: item.forum_posts,
        chatMessages: item.chat_messages,
        resourceUploads: item.resource_uploads,
        activeUsers: item.active_users,
        createdAt: new Date(item.created_at)
      })) as ActivityStat[];
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
      
      return data.map(item => ({
        id: item.id,
        period: item.period,
        amount: item.amount,
        subscriptions: item.subscriptions,
        renewals: item.renewals,
        createdAt: new Date(item.created_at)
      })) as RevenueStat[];
    }
  });

  return {
    membershipStats,
    activityStats,
    revenueStats,
    isError: isMembershipError || isActivityError || isRevenueError
  };
}
