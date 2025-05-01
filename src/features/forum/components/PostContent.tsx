
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ForumPost, ForumCategory } from '@/types';
import { formatDateWithTime } from '../utils/formatters';

interface PostContentProps {
  post: ForumPost;
  category: ForumCategory | null;
  hasLiked: boolean;
  isLiking: boolean;
  isAuthenticated: boolean;
  commentsCount: number;
  handleLikePost: () => void;
}

const PostContent = ({ 
  post, 
  category, 
  hasLiked, 
  isLiking, 
  isAuthenticated,
  commentsCount,
  handleLikePost 
}: PostContentProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
            <span>Posted by {post.authorName}</span>
            <span>•</span>
            <span>{formatDateWithTime(post.createdAt)}</span>
            {category && (
              <>
                <span>•</span>
                <Badge variant="outline">{category.name}</Badge>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex items-center gap-1 ${hasLiked ? 'text-blue-500' : 'text-muted-foreground'}`}
            onClick={handleLikePost}
            disabled={isLiking || !isAuthenticated}
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{post.likesCount}</span>
          </Button>
          <div className="flex items-center text-muted-foreground">
            <MessageSquare className="mr-1 h-4 w-4" />
            <span>{commentsCount}</span>
          </div>
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostContent;
