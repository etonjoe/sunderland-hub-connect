
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  messageInput: string;
  onMessageChange: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
}

const ChatInput = ({ messageInput, onMessageChange, onSendMessage }: ChatInputProps) => {
  return (
    <form onSubmit={onSendMessage} className="p-4 border-t flex gap-2">
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
  );
};

export default ChatInput;
