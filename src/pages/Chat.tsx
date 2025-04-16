
import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import { ChatMessage, ChatGroup } from '@/types';
import { Lock, Send, User, Users } from 'lucide-react';

// Sample data
const MESSAGES: ChatMessage[] = [
  {
    id: '1',
    content: 'Hey everyone! How\'s it going?',
    senderId: '3',
    senderName: 'Premium User',
    groupId: '1',
    timestamp: new Date('2023-05-20T10:15:00'),
    read: true
  },
  {
    id: '2',
    content: 'All good here! Planning for the summer reunion.',
    senderId: '1',
    senderName: 'Admin User',
    groupId: '1',
    timestamp: new Date('2023-05-20T10:17:00'),
    read: true
  },
  {
    id: '3',
    content: 'I uploaded some family tree documents to the resources section.',
    senderId: '3',
    senderName: 'Premium User',
    groupId: '1',
    timestamp: new Date('2023-05-20T10:19:00'),
    read: true
  },
  {
    id: '4',
    content: 'Thanks! I\'ll check them out.',
    senderId: '1',
    senderName: 'Admin User',
    groupId: '1',
    timestamp: new Date('2023-05-20T10:20:00'),
    read: true
  },
  {
    id: '5',
    content: 'Did anyone see the announcement about the next meetup?',
    senderId: '3',
    senderName: 'Premium User',
    groupId: '1',
    timestamp: new Date('2023-05-20T10:22:00'),
    read: true
  }
];

const GROUPS: ChatGroup[] = [
  {
    id: '1',
    name: 'Family General',
    memberIds: ['1', '2', '3'],
    createdAt: new Date('2023-01-01')
  },
  {
    id: '2',
    name: 'Event Planning',
    memberIds: ['1', '3'],
    createdAt: new Date('2023-02-15')
  },
  {
    id: '3',
    name: 'Genealogy Research',
    memberIds: ['1', '2', '3'],
    createdAt: new Date('2023-03-10')
  }
];

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const isPremium = user?.isPremium || false;
  
  useEffect(() => {
    // Filter messages based on active conversation
    setChatMessages(MESSAGES.filter(msg => msg.groupId === activeConversation));
  }, [activeConversation]);
  
  useEffect(() => {
    // Scroll to bottom on new messages
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [chatMessages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !user) return;
    
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      content: messageInput,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: undefined,
      groupId: activeConversation,
      timestamp: new Date(),
      read: true
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setMessageInput('');
  };
  
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
        <div className="md:col-span-1 space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-medium text-muted-foreground px-2">GROUP CHATS</h2>
            <div className="space-y-1">
              {GROUPS.map(group => (
                <Button
                  key={group.id}
                  variant="ghost"
                  className={`w-full justify-start ${activeConversation === group.id ? 'bg-muted' : ''}`}
                  onClick={() => setActiveConversation(group.id)}
                >
                  <Users className="mr-2 h-4 w-4" />
                  <span className="truncate">{group.name}</span>
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-1">
            <h2 className="text-sm font-medium text-muted-foreground px-2">DIRECT MESSAGES</h2>
            <div className="space-y-1">
              {DIRECT_CHATS.map(chat => (
                <Button
                  key={chat.id}
                  variant="ghost"
                  className={`w-full justify-start ${activeConversation === chat.id ? 'bg-muted' : ''}`}
                  onClick={() => setActiveConversation(chat.id)}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span className="truncate">{chat.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="md:col-span-3 flex flex-col h-full">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardContent className="flex-1 p-0 flex flex-col h-full">
              <div className="p-4 border-b bg-muted/50">
                <h2 className="font-semibold">
                  {GROUPS.find(g => g.id === activeConversation)?.name || 
                   DIRECT_CHATS.find(d => d.id === activeConversation)?.name || 
                   'Chat'}
                </h2>
              </div>
              
              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {chatMessages.map(message => (
                    <div key={message.id} className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex ${message.senderId === user?.id ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 max-w-[75%]`}>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-family-blue text-white">
                            {message.senderName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className={`px-3 py-2 rounded-lg ${
                            message.senderId === user?.id 
                              ? 'bg-family-blue text-white' 
                              : 'bg-muted'
                          }`}>
                            <p>{message.content}</p>
                          </div>
                          <div className={`text-xs text-muted-foreground mt-1 ${message.senderId === user?.id ? 'text-right' : ''}`}>
                            <span className="font-medium">{message.senderName}</span> • {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" className="bg-family-blue hover:bg-blue-600">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chat;
