
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatMessage as ChatMessageType } from '@/types';

interface ChatMessageProps {
  message: ChatMessageType;
  isCurrentUser: boolean;
  formatTime: (date: Date) => string;
}

const ChatMessage = ({ message, isCurrentUser, formatTime }: ChatMessageProps) => {
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
            <p>{message.content}</p>
          </div>
          <div className={`text-xs text-muted-foreground mt-1 ${isCurrentUser ? 'text-right' : ''}`}>
            <span className="font-medium">{message.senderName}</span> • {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
