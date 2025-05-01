
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatGroup } from '@/types';
import { toast } from 'sonner';

export const useChatGroups = (userId?: string) => {
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [lastCreatedGroupId, setLastCreatedGroupId] = useState<string | null>(null);

  const fetchChatGroups = useCallback(async () => {
    if (!userId) {
      setIsLoadingGroups(false);
      setChatGroups([]);
      return [];
    }
    
    try {
      console.log('Fetching chat groups for user:', userId);
      
      const { data: membershipData, error: membershipError } = await supabase
        .from('chat_group_members')
        .select('group_id')
        .eq('user_id', userId);
      
      if (membershipError) {
        console.error('Error fetching memberships:', membershipError);
        toast.error('Failed to load chat group memberships');
        setIsLoadingGroups(false);
        return [];
      }
      
      console.log('User memberships:', membershipData);
      
      if (membershipData && membershipData.length > 0) {
        const groupIds = membershipData.map(item => item.group_id);
        
        const { data: groupsData, error: groupsError } = await supabase
          .from('chat_groups')
          .select('*')
          .in('id', groupIds)
          .order('created_at', { ascending: false });
        
        if (groupsError) {
          console.error('Error fetching groups:', groupsError);
          toast.error('Failed to load chat groups');
          setIsLoadingGroups(false);
          return [];
        }
        
        console.log('Groups data:', groupsData);
        
        const formattedGroups = groupsData.map(group => ({
          id: group.id,
          name: group.name,
          description: group.description,
          memberIds: [],
          createdAt: new Date(group.created_at)
        }));
        
        setChatGroups(formattedGroups);
        setIsLoadingGroups(false);
        return formattedGroups;
      } else {
        // No memberships found
        console.log('No group memberships found for user');
        setChatGroups([]);
        setIsLoadingGroups(false);
        return [];
      }
    } catch (error) {
      console.error('Error fetching chat groups:', error);
      toast.error('Failed to load chat groups');
      setIsLoadingGroups(false);
      return [];
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchChatGroups();
      
      // Set up real-time subscription for chat_group_members changes
      const channel = supabase
        .channel('chat_group_members_changes')
        .on('postgres_changes', 
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_group_members',
            filter: `user_id=eq.${userId}`
          }, 
          (payload) => {
            console.log('New chat group membership detected:', payload);
            fetchChatGroups();
          }
        )
        .subscribe();
      
      // Also set up subscription for chat_groups changes (for updates to group names, etc.)
      const groupsChannel = supabase
        .channel('chat_groups_changes')
        .on('postgres_changes',
          {
            event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
            schema: 'public',
            table: 'chat_groups'
          },
          () => {
            console.log('Chat groups table changed, refreshing');
            fetchChatGroups();
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
        supabase.removeChannel(groupsChannel);
      };
    } else {
      setChatGroups([]);
      setIsLoadingGroups(false);
    }
  }, [fetchChatGroups, userId]);

  const handleGroupCreated = useCallback(async (groupId?: string) => {
    if (userId) {
      console.log('Group created, refreshing groups list...', groupId);
      setIsLoadingGroups(true);
      if (groupId) {
        setLastCreatedGroupId(groupId);
      }
      await fetchChatGroups();
    }
  }, [userId, fetchChatGroups]);

  return {
    chatGroups,
    isLoadingGroups,
    handleGroupCreated,
    lastCreatedGroupId,
    setLastCreatedGroupId,
    refetchGroups: fetchChatGroups
  };
};
