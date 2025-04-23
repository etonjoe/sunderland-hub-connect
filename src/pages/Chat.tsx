import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { ChatMessage, ChatGroup } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatWindow from '@/components/chat/ChatWindow';

const DIRECT_CHATS = [
  {
    id: 'direct_1_3',
    name: 'Premium User',
    avatar: '',
    lastMessage: 'Thanks for the help with the research!'
  },
  {
    id: 'direct_1_2',
    name: 'Regular User',
    avatar: '',
    lastMessage: 'Are you coming to the reunion?'
  }
];

const Chat = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeConversation, setActiveConversation] = useState<string>('1');
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const isPremium = user?.isPremium || false;
  
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user || !activeConversation) return;
      
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
          senderName: user.name,
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
  }, [activeConversation, user]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !user) return;
    
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          content: messageInput,
          sender_id: user.id,
          group_id: activeConversation
        })
        .select('*')
        .single();
      
      if (error) throw error;
      
      const newMessage: ChatMessage = {
        id: data.id,
        content: data.content,
        senderId: data.sender_id,
        senderName: user.name,
        senderAvatar: user.avatar,
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
  
  useEffect(() => {
    const fetchChatGroups = async () => {
      if (!user) return;
      
      setIsLoadingGroups(true);
      try {
        const { data: membershipData, error: membershipError } = await supabase
          .from('chat_group_members')
          .select('group_id')
          .eq('user_id', user.id);
        
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
        } else {
          setChatGroups([]);
        }
      } catch (error) {
        console.error('Error fetching chat groups:', error);
        toast.error('Failed to load chat groups');
      } finally {
        setIsLoadingGroups(false);
      }
    };
    
    fetchChatGroups();
  }, [user]);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [chatMessages]);
  
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleGroupCreated = () => {
    if (user) {
      setIsLoadingGroups(true);
      
      const fetchGroups = async () => {
        try {
          const { data: membershipData, error: membershipError } = await supabase
            .from('chat_group_members')
            .select('group_id')
            .eq('user_id', user.id);
          
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
          } else {
            setChatGroups([]);
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
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isPremium) {
    return (
      <div className="container py-10 animate-fade-in">
        <div className="max-w-2xl mx-auto text-center">
          <Lock className="h-16 w-16 text-family-orange mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Premium Feature</h1>
          <p className="text-lg text-muted-foreground mb-6">
            The chat functionality is available exclusively to premium members.
            Upgrade your account to chat with family members.
          </p>
          <Button className="bg-family-orange hover:bg-orange-600">
            Upgrade to Premium
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-6 h-[calc(100vh-10rem)] animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Family Chat</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100%-4rem)]">
        <ChatSidebar
          chatGroups={chatGroups}
          directChats={DIRECT_CHATS}
          activeConversation={activeConversation}
          isLoadingGroups={isLoadingGroups}
          onConversationSelect={setActiveConversation}
          onGroupCreated={handleGroupCreated}
        />
        
        <div className="md:col-span-3 flex flex-col h-full">
          <ChatWindow
            ref={scrollAreaRef}
            activeGroup={chatGroups.find(g => g.id === activeConversation)}
            messages={chatMessages}
            isLoadingMessages={isLoadingMessages}
            currentUserId={user?.id}
            messageInput={messageInput}
            onMessageChange={setMessageInput}
            onSendMessage={handleSendMessage}
            formatTime={formatTime}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
