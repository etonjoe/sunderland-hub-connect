import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import ChatSidebar from '@/components/chat/ChatSidebar';
import ChatWindow from '@/components/chat/ChatWindow';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useChatGroups } from '@/hooks/useChatGroups';

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
  
  const {
    chatGroups,
    isLoadingGroups,
    handleGroupCreated
  } = useChatGroups(user?.id);

  const {
    chatMessages,
    isLoadingMessages,
    messageInput,
    setMessageInput,
    handleSendMessage
  } = useChatMessages(activeConversation, user?.id);
  
  const isPremium = user?.isPremium || false;
  
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
  
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
