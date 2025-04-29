
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { MembershipStat, ActivityStat, RevenueStat } from '@/types';
import { toast } from 'sonner';

export function useAdminStats() {
  const [realtimeStats, setRealtimeStats] = useState({
    membershipStats: [] as MembershipStat[],
    activityStats: [] as ActivityStat[],
    revenueStats: [] as RevenueStat[]
  });

  const { data: membershipStats = [], isError: isMembershipError, refetch: refetchMembership } = useQuery({
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
      
      const formattedData = data.map(item => ({
        id: item.id,
        period: item.period,
        totalUsers: item.total_users,
        premiumUsers: item.premium_users,
        retentionRate: item.retention_rate,
        createdAt: new Date(item.created_at)
      })) as MembershipStat[];

      setRealtimeStats(prev => ({
        ...prev,
        membershipStats: formattedData
      }));
      
      return formattedData;
    }
  });

  const { data: activityStats = [], isError: isActivityError, refetch: refetchActivity } = useQuery({
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
      
      const formattedData = data.map(item => ({
        id: item.id,
        period: item.period,
        forumPosts: item.forum_posts,
        chatMessages: item.chat_messages,
        resourceUploads: item.resource_uploads,
        activeUsers: item.active_users,
        createdAt: new Date(item.created_at)
      })) as ActivityStat[];

      setRealtimeStats(prev => ({
        ...prev,
        activityStats: formattedData
      }));
      
      return formattedData;
    }
  });

  const { data: revenueStats = [], isError: isRevenueError, refetch: refetchRevenue } = useQuery({
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
      
      const formattedData = data.map(item => ({
        id: item.id,
        period: item.period,
        amount: item.amount,
        subscriptions: item.subscriptions,
        renewals: item.renewals,
        createdAt: new Date(item.created_at)
      })) as RevenueStat[];

      setRealtimeStats(prev => ({
        ...prev,
        revenueStats: formattedData
      }));
      
      return formattedData;
    }
  });

  // Setup realtime subscriptions
  useEffect(() => {
    // Create a realtime channel to listen for changes
    const channel = supabase
      .channel('dashboard-stats-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'membership_stats' 
        }, 
        () => {
          refetchMembership();
          toast.success('Membership stats updated in real-time');
        }
      )
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'activity_stats' 
        }, 
        () => {
          refetchActivity();
          toast.success('Activity stats updated in real-time');
        }
      )
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'revenue_stats' 
        }, 
        () => {
          refetchRevenue();
          toast.success('Revenue stats updated in real-time');
        }
      )
      .subscribe();

    console.log('Real-time channel subscribed:', channel.state);

    // Cleanup function to unsubscribe from the channel
    return () => {
      supabase.removeChannel(channel);
      console.log('Real-time channel unsubscribed');
    };
  }, [refetchMembership, refetchActivity, refetchRevenue]);

  // Return the combined data from both initial fetch and realtime updates
  return {
    membershipStats: membershipStats.length > 0 ? membershipStats : realtimeStats.membershipStats,
    activityStats: activityStats.length > 0 ? activityStats : realtimeStats.activityStats,
    revenueStats: revenueStats.length > 0 ? revenueStats : realtimeStats.revenueStats,
    isError: isMembershipError || isActivityError || isRevenueError
  };
}
