
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from '@/types';
import { toast } from 'sonner';

export const useChatMessages = (activeConversation: string, currentUserId?: string) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Security: Add rate limiting for API calls
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const MIN_FETCH_INTERVAL = 1000; // 1 second

  const fetchMessages = useCallback(async () => {
    if (!activeConversation) {
      setChatMessages([]);
      setIsLoadingMessages(false);
      return;
    }
    
    if (!currentUserId) {
      console.error('No current user ID provided');
      setIsLoadingMessages(false);
      return;
    }
    
    // Security: Rate limiting for API calls
    const now = Date.now();
    if (now - lastFetchTime < MIN_FETCH_INTERVAL) {
      return;
    }
    setLastFetchTime(now);
    
    setIsLoadingMessages(true);
    setError(null);
    
    try {
      console.log('Fetching messages for conversation:', activeConversation);
      
      // Validate user is a member of this group first
      const { data: membershipData, error: membershipError } = await supabase
        .from('chat_group_members')
        .select('user_id')
        .eq('group_id', activeConversation)
        .eq('user_id', currentUserId)
        .maybeSingle();
      
      if (membershipError) {
        console.error('Error checking group membership:', membershipError);
        throw new Error('Failed to verify group membership');
      }
      
      if (!membershipData) {
        console.error('User is not a member of this group');
        throw new Error('You are not a member of this chat group');
      }
      
      // Security: Validate UUID format to prevent SQL injection
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(activeConversation)) {
        throw new Error("Invalid conversation ID format");
      }
      
      // Using a separate query to join profiles data
      const { data: messagesData, error } = await supabase
        .from('chat_messages')
        .select(`
          id,
          content,
          sender_id,
          group_id,
          created_at,
          read,
          reply_to_id
        `)
        .eq('group_id', activeConversation)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

      if (!messagesData) {
        console.log('No messages found for this conversation');
        setChatMessages([]);
        setIsLoadingMessages(false);
        return;
      }

      console.log(`Fetched ${messagesData.length} messages`);

      // For each message, get the sender profile in a separate step
      const messagesWithProfiles = await Promise.all(messagesData.map(async (msg) => {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('name, avatar')
          .eq('id', msg.sender_id)
          .single();
        
        if (profileError) {
          console.warn(`Could not fetch profile for sender ${msg.sender_id}:`, profileError);
        }
        
        return {
          id: msg.id,
          content: msg.content,
          senderId: msg.sender_id,
          senderName: profileData?.name ?? 'Unknown User',
          senderAvatar: profileData?.avatar ?? '',
          groupId: msg.group_id,
          timestamp: new Date(msg.created_at),
          read: msg.read,
          reply_to_id: msg.reply_to_id
        };
      }));
      
      setChatMessages(messagesWithProfiles);
      setIsLoadingMessages(false);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      setError(error?.message || 'Failed to load messages');
      toast.error(error?.message || 'Failed to load messages');
      setChatMessages([]);
      setIsLoadingMessages(false);
    }
  }, [activeConversation, currentUserId, lastFetchTime]);

  useEffect(() => {
    if (activeConversation && currentUserId) {
      fetchMessages();
      
      // Set up real-time subscription for new messages
      const subscription = supabase
        .channel(`chat_messages_${activeConversation}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `group_id=eq.${activeConversation}`
        }, () => {
          console.log('New message received, refreshing messages');
          fetchMessages(); // Refresh messages when a new one arrives
        })
        .subscribe();
        
      return () => {
        subscription.unsubscribe();
      };
    } else {
      setChatMessages([]);
    }
  }, [activeConversation, currentUserId, fetchMessages]);

  const handleSendMessage = async (e: React.FormEvent, replyToId?: string) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !currentUserId || !activeConversation) {
      console.error('Missing required data for sending message', { messageInput, currentUserId, activeConversation });
      return;
    }
    
    // Security: Maximum message length validation
    if (messageInput.length > 2000) {
      toast.error("Message is too long (maximum 2000 characters)");
      return;
    }
    
    try {
      // Security: Sanitize input and validate
      const sanitizedInput = messageInput.trim();
      
      console.log('Sending message:', {
        content: sanitizedInput,
        sender_id: currentUserId,
        group_id: activeConversation,
        reply_to_id: replyToId || null
      });
      
      // First, check that the user is a member of this group
      const { data: membershipData, error: membershipError } = await supabase
        .from('chat_group_members')
        .select('user_id')
        .eq('group_id', activeConversation)
        .eq('user_id', currentUserId)
        .maybeSingle();
        
      if (membershipError || !membershipData) {
        console.error('Error checking membership or user is not a member:', membershipError);
        toast.error("You are not a member of this chat group");
        return;
      }
      
      // Then insert the message
      const { data: messageData, error: messageError } = await supabase
        .from('chat_messages')
        .insert({
          content: sanitizedInput,
          sender_id: currentUserId,
          group_id: activeConversation,
          reply_to_id: replyToId || null
        })
        .select()
        .single();
      
      if (messageError) {
        console.error('Error details:', messageError);
        throw messageError;
      }
      
      // Then fetch the profile separately
      const { data: profileData } = await supabase
        .from('profiles')
        .select('name, avatar')
        .eq('id', currentUserId)
        .single();
      
      // Add the new message to the chat with profile data
      const newMessage: ChatMessage = {
        id: messageData.id,
        content: messageData.content,
        senderId: messageData.sender_id,
        senderName: profileData?.name ?? 'Unknown User',
        senderAvatar: profileData?.avatar ?? '',
        groupId: messageData.group_id,
        timestamp: new Date(messageData.created_at),
        read: false,
        reply_to_id: messageData.reply_to_id
      };
      
      setChatMessages(prev => [...prev, newMessage]);
      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  return {
    chatMessages,
    isLoadingMessages,
    messageInput,
    setMessageInput,
    handleSendMessage,
    error,
    refetchMessages: fetchMessages
  };
};
