
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { ChatMessage as ChatMessageType, ChatGroup } from '@/types';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { forwardRef, useState, useEffect, useRef } from 'react';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import DOMPurify from 'dompurify';

interface ChatWindowProps {
  activeGroup?: ChatGroup;
  messages: ChatMessageType[];
  isLoadingMessages: boolean;
  currentUserId?: string;
  messageInput: string;
  onMessageChange: (value: string) => void;
  onSendMessage: (e: React.FormEvent, replyToId?: string) => void;
  formatTime: (date: Date) => string;
}

const ChatWindow = forwardRef<HTMLDivElement, ChatWindowProps>(({
  activeGroup,
  messages,
  isLoadingMessages,
  currentUserId,
  messageInput,
  onMessageChange,
  onSendMessage,
  formatTime
}, ref) => {
  const [replyToId, setReplyToId] = useState<string | undefined>();
  const [replyingToMessage, setReplyingToMessage] = useState<ChatMessageType | null>(null);
  const { isAuthenticated } = useAuth();
  const messageRateLimitRef = useRef<number>(0);
  const lastMessageTimeRef = useRef<number>(Date.now());
  const MAX_MESSAGES_PER_MINUTE = 20;
  const RATE_LIMIT_RESET_MS = 60000; // 1 minute
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Find the message being replied to when replyToId changes
  useEffect(() => {
    if (replyToId) {
      const message = messages.find(m => m.id === replyToId);
      setReplyingToMessage(message || null);
    } else {
      setReplyingToMessage(null);
    }
  }, [replyToId, messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleReply = (messageId: string) => {
    // Check if the message exists before setting it as a reply target
    if (!messages.find(m => m.id === messageId)) {
      toast.error("Cannot reply to this message.");
      return;
    }
    setReplyToId(messageId);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Security check: User must be authenticated
    if (!isAuthenticated) {
      toast.error("You must be logged in to send messages");
      return;
    }

    // Security check: Empty or overly long messages
    const sanitizedMessage = DOMPurify.sanitize(messageInput.trim());
    if (!sanitizedMessage) {
      toast.error("Message cannot be empty");
      return;
    }
    
    if (sanitizedMessage.length > 2000) {
      toast.error("Message is too long (maximum 2000 characters)");
      return;
    }

    // Security check: Rate limiting
    const now = Date.now();
    if (now - lastMessageTimeRef.current > RATE_LIMIT_RESET_MS) {
      // Reset counter after 1 minute
      messageRateLimitRef.current = 0;
      lastMessageTimeRef.current = now;
    }
    
    messageRateLimitRef.current++;
    
    if (messageRateLimitRef.current > MAX_MESSAGES_PER_MINUTE) {
      toast.error("You're sending messages too quickly. Please wait a moment.");
      return;
    }

    // Security check: User must belong to the active group
    if (!activeGroup) {
      toast.error("No active conversation selected");
      return;
    }

    // All checks passed, send the message
    onSendMessage(e, replyToId);
    setReplyToId(undefined);
  };

  return (
    <Card className="flex-1 flex flex-col overflow-hidden">
      <CardContent className="flex-1 p-0 flex flex-col h-full">
        <div className="p-4 border-b bg-muted/50">
          <h2 className="font-semibold">
            {activeGroup?.name || 'Chat'}
          </h2>
        </div>
        
        <ScrollArea className="flex-1 p-4" ref={ref}>
          <div className="space-y-4">
            {isLoadingMessages ? (
              <div className="text-center text-muted-foreground">
                Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-muted-foreground">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map(message => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isCurrentUser={message.senderId === currentUserId}
                  currentUserId={currentUserId}
                  formatTime={formatTime}
                  onReply={handleReply}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <ChatInput
          messageInput={messageInput}
          onMessageChange={onMessageChange}
          onSendMessage={handleSendMessage}
          replyToId={replyToId}
          replyingToMessage={replyingToMessage}
          onCancelReply={() => setReplyToId(undefined)}
        />
      </CardContent>
    </Card>
  );
});

ChatWindow.displayName = 'ChatWindow';

export default ChatWindow;
