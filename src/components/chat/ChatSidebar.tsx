
import { Button } from "@/components/ui/button";
import { Users, User } from "lucide-react";
import { ChatGroup } from '@/types';
import CreateChatGroup from './CreateChatGroup';

interface ChatSidebarProps {
  chatGroups: ChatGroup[];
  directChats: Array<{
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
  }>;
  activeConversation: string;
  isLoadingGroups: boolean;
  onConversationSelect: (id: string) => void;
  onGroupCreated: () => void;
}

const ChatSidebar = ({
  chatGroups,
  directChats,
  activeConversation,
  isLoadingGroups,
  onConversationSelect,
  onGroupCreated
}: ChatSidebarProps) => {
  return (
    <div className="md:col-span-1 space-y-4">
      <div className="space-y-1">
        <h2 className="text-sm font-medium text-muted-foreground px-2">GROUP CHATS</h2>
        <div className="space-y-1">
          {isLoadingGroups ? (
            <div className="px-2 py-1 text-sm text-muted-foreground">Loading...</div>
          ) : (
            <>
              {chatGroups.map(group => (
                <Button
                  key={group.id}
                  variant="ghost"
                  className={`w-full justify-start ${activeConversation === group.id ? 'bg-muted' : ''}`}
                  onClick={() => onConversationSelect(group.id)}
                >
                  <Users className="mr-2 h-4 w-4" />
                  <span className="truncate">{group.name}</span>
                </Button>
              ))}
              <CreateChatGroup onGroupCreated={onGroupCreated} />
            </>
          )}
        </div>
      </div>
      
      <div className="space-y-1">
        <h2 className="text-sm font-medium text-muted-foreground px-2">DIRECT MESSAGES</h2>
        <div className="space-y-1">
          {directChats.map(chat => (
            <Button
              key={chat.id}
              variant="ghost"
              className={`w-full justify-start ${activeConversation === chat.id ? 'bg-muted' : ''}`}
              onClick={() => onConversationSelect(chat.id)}
            >
              <User className="mr-2 h-4 w-4" />
              <span className="truncate">{chat.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
