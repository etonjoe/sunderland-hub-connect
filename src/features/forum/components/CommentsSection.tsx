
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ForumComment } from '@/types';
import { formatDateWithTime } from '../utils/formatters';

interface CommentsSectionProps {
  comments: ForumComment[];
  isAuthenticated: boolean;
  newComment: string;
  isSubmitting: boolean;
  setNewComment: (comment: string) => void;
  handleCommentSubmit: (e: React.FormEvent) => void;
}

const CommentsSection = ({
  comments,
  isAuthenticated,
  newComment,
  isSubmitting,
  setNewComment,
  handleCommentSubmit
}: CommentsSectionProps) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Comments ({comments.length})</h2>
      
      {isAuthenticated ? (
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <Textarea 
            placeholder="Share your thoughts..." 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-2 min-h-24"
          />
          <Button 
            type="submit" 
            disabled={isSubmitting || !newComment.trim()}
            className="ml-auto block"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </form>
      ) : (
        <Card className="p-4 mb-6 bg-muted">
          <p className="text-center text-muted-foreground">
            Please <Link to="/login" className="text-blue-500 hover:underline">log in</Link> to post a comment.
          </p>
        </Card>
      )}
      
      <Separator className="my-4" />
      
      {comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <Card key={comment.id}>
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{comment.authorName}</span>
                  <span className="text-sm text-muted-foreground">{formatDateWithTime(comment.createdAt)}</span>
                </div>
              </CardHeader>
              <CardContent className="py-2">
                <p className="whitespace-pre-wrap">{comment.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
