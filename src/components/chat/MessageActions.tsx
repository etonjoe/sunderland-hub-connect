
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ThumbsUp, ThumbsDown, Heart } from "lucide-react";

interface MessageActionsProps {
  messageId: string;
  currentUserId?: string;
  onReply: () => void;
}

export const MessageActions = ({ messageId, currentUserId, onReply }: MessageActionsProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [vote, setVote] = useState<'up' | 'down' | null>(null);

  const handleLike = async () => {
    if (!currentUserId) return;
    
    try {
      if (isLiked) {
        await supabase
          .from('chat_message_reactions')
          .delete()
          .match({ message_id: messageId, user_id: currentUserId, type: 'like' });
        setIsLiked(false);
      } else {
        await supabase
          .from('chat_message_reactions')
          .insert({ message_id: messageId, user_id: currentUserId, type: 'like' });
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like status');
    }
  };

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!currentUserId) return;
    
    try {
      if (vote === voteType) {
        // Remove vote
        await supabase
          .from('chat_message_votes')
          .delete()
          .match({ message_id: messageId, user_id: currentUserId });
        setVote(null);
      } else {
        // Update or insert vote
        if (vote) {
          await supabase
            .from('chat_message_votes')
            .update({ vote_type: voteType })
            .match({ message_id: messageId, user_id: currentUserId });
        } else {
          await supabase
            .from('chat_message_votes')
            .insert({ message_id: messageId, user_id: currentUserId, vote_type: voteType });
        }
        setVote(voteType);
      }
    } catch (error) {
      console.error('Error updating vote:', error);
      toast.error('Failed to update vote');
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <Button
        variant="ghost"
        size="sm"
        className={`hover:text-blue-500 ${vote === 'up' ? 'text-blue-500' : ''}`}
        onClick={() => handleVote('up')}
      >
        <ThumbsUp className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`hover:text-red-500 ${vote === 'down' ? 'text-red-500' : ''}`}
        onClick={() => handleVote('down')}
      >
        <ThumbsDown className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`hover:text-pink-500 ${isLiked ? 'text-pink-500' : ''}`}
        onClick={handleLike}
      >
        <Heart className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onReply}
      >
        Reply
      </Button>
    </div>
  );
};
