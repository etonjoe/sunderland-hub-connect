
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X } from "lucide-react";

interface ChatInputProps {
  messageInput: string;
  onMessageChange: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  replyToId?: string;
  onCancelReply: () => void;
}

const ChatInput = ({ messageInput, onMessageChange, onSendMessage, replyToId, onCancelReply }: ChatInputProps) => {
  return (
    <div className="p-4 border-t">
      {replyToId && (
        <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
          <span>Replying to message</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onCancelReply}
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
        />
        <Button type="submit" className="bg-family-blue hover:bg-blue-600">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
