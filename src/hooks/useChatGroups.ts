
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatGroup } from '@/types';
import { toast } from 'sonner';

export const useChatGroups = (userId?: string) => {
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);

  useEffect(() => {
    const fetchChatGroups = async () => {
      if (!userId) return;
      
      try {
        const { data: membershipData, error: membershipError } = await supabase
          .from('chat_group_members')
          .select('group_id')
          .eq('user_id', userId);
        
        if (membershipError) throw membershipError;
        
        if (membershipData && membershipData.length > 0) {
          const groupIds = membershipData.map(item => item.group_id);
          
          const { data: groupsData, error: groupsError } = await supabase
            .from('chat_groups')
            .select('*')
            .in('id', groupIds);
          
          if (groupsError) throw groupsError;
          
          setChatGroups(groupsData.map(group => ({
            id: group.id,
            name: group.name,
            memberIds: [],
            createdAt: new Date(group.created_at)
          })));
        }
      } catch (error) {
        console.error('Error fetching chat groups:', error);
        toast.error('Failed to load chat groups');
      } finally {
        setIsLoadingGroups(false);
      }
    };
    
    fetchChatGroups();
  }, [userId]);

  const handleGroupCreated = () => {
    if (userId) {
      setIsLoadingGroups(true);
      // Re-fetch groups
      const fetchGroups = async () => {
        try {
          const { data: membershipData, error: membershipError } = await supabase
            .from('chat_group_members')
            .select('group_id')
            .eq('user_id', userId);
          
          if (membershipError) throw membershipError;
          
          if (membershipData && membershipData.length > 0) {
            const groupIds = membershipData.map(item => item.group_id);
            
            const { data: groupsData, error: groupsError } = await supabase
              .from('chat_groups')
              .select('*')
              .in('id', groupIds);
            
            if (groupsError) throw groupsError;
            
            setChatGroups(groupsData.map(group => ({
              id: group.id,
              name: group.name,
              memberIds: [],
              createdAt: new Date(group.created_at)
            })));
          }
        } catch (error) {
          console.error('Error refreshing chat groups:', error);
          toast.error('Failed to refresh chat groups');
        } finally {
          setIsLoadingGroups(false);
        }
      };
      
      fetchGroups();
    }
  };

  return {
    chatGroups,
    isLoadingGroups,
    handleGroupCreated
  };
};
