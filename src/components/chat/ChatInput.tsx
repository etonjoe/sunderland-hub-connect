
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X } from "lucide-react";
import { ChatMessage } from '@/types';

interface ChatInputProps {
  messageInput: string;
  onMessageChange: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  replyToId?: string;
  replyingToMessage?: ChatMessage | null;
  onCancelReply: () => void;
}

const ChatInput = ({ 
  messageInput, 
  onMessageChange, 
  onSendMessage, 
  replyToId, 
  replyingToMessage,
  onCancelReply 
}: ChatInputProps) => {
  // Safely truncate content preview to prevent potential XSS
  const getReplyPreview = () => {
    if (!replyingToMessage) return "message";
    
    const content = replyingToMessage.content || "";
    const truncated = content.length > 20 
      ? content.substring(0, 20) + "..." 
      : content;
      
    return truncated;
  };
  
  return (
    <div className="p-4 border-t">
      {replyToId && (
        <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
          <span>
            Replying to: {getReplyPreview()}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onCancelReply}
            type="button"
            aria-label="Cancel reply"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      <form onSubmit={onSendMessage} className="flex gap-2">
        <Input
          placeholder="Type your message..."
          value={messageInput}
          onChange={(e) => onMessageChange(e.target.value)}
          className="flex-1"
          maxLength={2000}
          aria-label="Message input"
        />
        <Button 
          type="submit" 
          className="bg-family-blue hover:bg-blue-600"
          disabled={!messageInput.trim()}
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
