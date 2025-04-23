
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from '@/types';
import { toast } from 'sonner';

export const useChatMessages = (activeConversation: string, currentUserId?: string) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUserId || !activeConversation) return;
      
      setIsLoadingMessages(true);
      try {
        const { data: messagesData, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('group_id', activeConversation)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        setChatMessages(messagesData.map(msg => ({
          id: msg.id,
          content: msg.content,
          senderId: msg.sender_id,
          senderName: 'User', // This should be updated with actual user data
          groupId: msg.group_id,
          timestamp: new Date(msg.created_at),
          read: msg.read
        })));
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setIsLoadingMessages(false);
      }
    };
    
    fetchMessages();
  }, [activeConversation, currentUserId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !currentUserId) return;
    
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          content: messageInput,
          sender_id: currentUserId,
          group_id: activeConversation
        })
        .select('*')
        .single();
      
      if (error) throw error;
      
      const newMessage: ChatMessage = {
        id: data.id,
        content: data.content,
        senderId: data.sender_id,
        senderName: 'User', // This should be updated with actual user data
        groupId: data.group_id,
        timestamp: new Date(data.created_at),
        read: false
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
    handleSendMessage
  };
};
