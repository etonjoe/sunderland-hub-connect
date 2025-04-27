
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
    if (!currentUserId || !activeConversation) return;
    
    // Security: Rate limiting for API calls
    const now = Date.now();
    if (now - lastFetchTime < MIN_FETCH_INTERVAL) {
      return;
    }
    setLastFetchTime(now);
    
    setIsLoadingMessages(true);
    setError(null);
    
    try {
      // Security: Validate UUID format to prevent SQL injection
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(activeConversation)) {
        throw new Error("Invalid conversation ID format");
      }
      
      // Fixed query to properly join with profiles using the sender_id field
      const { data: messagesData, error } = await supabase
        .from('chat_messages')
        .select(`
          id,
          content,
          sender_id,
          group_id,
          created_at,
          read,
          reply_to_id,
          profiles!sender_id(name, avatar)
        `)
        .eq('group_id', activeConversation)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      // Transform the data with proper type handling and nullish coalescing
      setChatMessages(messagesData.map(msg => ({
        id: msg.id,
        content: msg.content,
        senderId: msg.sender_id,
        senderName: msg.profiles?.name ?? 'Unknown User',
        senderAvatar: msg.profiles?.avatar ?? '',
        groupId: msg.group_id,
        timestamp: new Date(msg.created_at),
        read: msg.read,
        reply_to_id: msg.reply_to_id
      })));
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages');
      toast.error('Failed to load messages');
    } finally {
      setIsLoadingMessages(false);
    }
  }, [activeConversation, currentUserId, lastFetchTime]);

  useEffect(() => {
    fetchMessages();
    
    // Set up real-time subscription for new messages
    if (activeConversation && currentUserId) {
      const subscription = supabase
        .channel('chat_messages')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `group_id=eq.${activeConversation}`
        }, (payload) => {
          fetchMessages(); // Refresh messages when a new one arrives
        })
        .subscribe();
        
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [activeConversation, currentUserId, fetchMessages]);

  const handleSendMessage = async (e: React.FormEvent, replyToId?: string) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !currentUserId || !activeConversation) return;
    
    // Security: Maximum message length validation
    if (messageInput.length > 2000) {
      toast.error("Message is too long (maximum 2000 characters)");
      return;
    }
    
    try {
      // Security: Sanitize input and validate
      const sanitizedInput = messageInput.trim();
      
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          content: sanitizedInput,
          sender_id: currentUserId,
          group_id: activeConversation,
          reply_to_id: replyToId
        })
        .select(`
          id,
          content,
          sender_id,
          group_id,
          created_at,
          read,
          reply_to_id,
          profiles!sender_id(name, avatar)
        `)
        .single();
      
      if (error) throw error;
      
      // Add the new message to the chat with proper type handling and nullish coalescing
      const newMessage: ChatMessage = {
        id: data.id,
        content: data.content,
        senderId: data.sender_id,
        senderName: data.profiles?.name ?? 'Unknown User',
        senderAvatar: data.profiles?.avatar ?? '',
        groupId: data.group_id,
        timestamp: new Date(data.created_at),
        read: false,
        reply_to_id: data.reply_to_id
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
    error
  };
};
