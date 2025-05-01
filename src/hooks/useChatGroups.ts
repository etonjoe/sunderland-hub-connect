
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
      
      // Get all chat groups where the user is a member
      const { data: membershipData, error: membershipError } = await supabase
        .from('chat_group_members')
        .select('group_id')
        .eq('user_id', userId);
      
      if (membershipError) {
        console.error('Error fetching group memberships:', membershipError);
        throw membershipError;
      }
      
      if (!membershipData || membershipData.length === 0) {
        console.log('User is not a member of any groups');
        setChatGroups([]);
        setIsLoadingGroups(false);
        return [];
      }
      
      // Extract the group IDs
      const groupIds = membershipData.map(item => item.group_id);
      
      // Get the group details
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
      
      if (groupsData && groupsData.length > 0) {
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
        // No groups found
        console.log('No chat groups found for user');
        setChatGroups([]);
        setIsLoadingGroups(false);
        return [];
      }
    } catch (error: any) {
      console.error('Error fetching chat groups:', error);
      toast.error(`Failed to load chat groups: ${error?.message || 'Please try again'}`);
      setIsLoadingGroups(false);
      return [];
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchChatGroups();
      
      // Set up real-time subscription for chat_groups changes
      const channel = supabase
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
      
      // Set up real-time subscription for chat_group_members changes
      const membersChannel = supabase
        .channel('chat_group_members_changes')
        .on('postgres_changes', 
          {
            event: '*',
            schema: 'public',
            table: 'chat_group_members'
          }, 
          (payload) => {
            console.log('Chat group membership changed:', payload);
            fetchChatGroups();
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
        supabase.removeChannel(membersChannel);
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
      // Add a small delay to ensure the database has been updated
      setTimeout(async () => {
        await fetchChatGroups();
      }, 500);
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
