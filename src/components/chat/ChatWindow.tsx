
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { ChatMessage as ChatMessageType, ChatGroup } from '@/types';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { forwardRef, useState } from 'react';

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

  const handleReply = (messageId: string) => {
    setReplyToId(messageId);
  };

  const handleSendMessage = (e: React.FormEvent) => {
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
          </div>
        </ScrollArea>
        
        <ChatInput
          messageInput={messageInput}
          onMessageChange={onMessageChange}
          onSendMessage={handleSendMessage}
          replyToId={replyToId}
          onCancelReply={() => setReplyToId(undefined)}
        />
      </CardContent>
    </Card>
  );
});

ChatWindow.displayName = 'ChatWindow';

export default ChatWindow;
