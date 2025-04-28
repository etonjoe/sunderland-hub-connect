
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
        throw membershipError;
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
          throw groupsError;
        }
        
        console.log('Groups data:', groupsData);
        
        const formattedGroups = groupsData.map(group => ({
          id: group.id,
          name: group.name,
          memberIds: [],
          createdAt: new Date(group.created_at)
        }));
        
        setChatGroups(formattedGroups);
        return formattedGroups;
      } else {
        // No memberships found
        console.log('No group memberships found for user');
        setChatGroups([]);
        return [];
      }
    } catch (error) {
      console.error('Error fetching chat groups:', error);
      toast.error('Failed to load chat groups');
      return [];
    } finally {
      setIsLoadingGroups(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchChatGroups();
    
    // Set up real-time subscription for chat_group_members changes
    if (userId) {
      const subscription = supabase
        .channel('chat_group_members_changes')
        .on('postgres_changes', 
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_group_members',
            filter: `user_id=eq.${userId}`
          }, 
          () => {
            console.log('New chat group membership detected, refreshing groups');
            fetchChatGroups();
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(subscription);
      };
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
    setLastCreatedGroupId
  };
};
