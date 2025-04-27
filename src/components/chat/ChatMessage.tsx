
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatMessage as ChatMessageType } from '@/types';
import { MessageActions } from './MessageActions';

interface ChatMessageProps {
  message: ChatMessageType;
  isCurrentUser: boolean;
  currentUserId?: string;
  formatTime: (date: Date) => string;
  onReply: (messageId: string) => void;
}

const ChatMessage = ({ message, isCurrentUser, currentUserId, formatTime, onReply }: ChatMessageProps) => {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 max-w-[75%]`}>
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.senderAvatar} />
          <AvatarFallback className="bg-family-blue text-white">
            {message.senderName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className={`px-3 py-2 rounded-lg ${
            isCurrentUser 
              ? 'bg-family-blue text-white' 
              : 'bg-muted'
          }`}>
            {message.reply_to_id && (
              <div className="text-xs mb-1 opacity-75">
                Replying to a message
              </div>
            )}
            <p>{message.content}</p>
          </div>
          <div className={`text-xs text-muted-foreground mt-1 ${isCurrentUser ? 'text-right' : ''}`}>
            <span className="font-medium">{message.senderName}</span> • {formatTime(message.timestamp)}
          </div>
          <MessageActions 
            messageId={message.id}
            currentUserId={currentUserId}
            onReply={() => onReply(message.id)}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
