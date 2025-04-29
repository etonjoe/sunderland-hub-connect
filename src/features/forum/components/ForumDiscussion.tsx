
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { ForumPost } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ForumDiscussionProps {
  selectedForum: ForumPost | null;
  isAuthenticated: boolean;
  user: any;
  formatDate: (date: Date) => string;
}

const ForumDiscussion = ({
  selectedForum,
  isAuthenticated,
  user,
  formatDate
}: ForumDiscussionProps) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Reset state when a new forum is selected
    setComments([]);
    setNewComment('');
    setIsLoading(false);
    
    // Fetch comments when a forum is selected
    const fetchComments = async () => {
      if (!selectedForum) return;
      
      setIsLoading(true);
      try {
        // Fetch comments
        const { data: commentsData, error: commentsError } = await supabase
          .from('forum_comments')
          .select(`
            id,
            content,
            created_at,
            updated_at,
            author_id
          `)
          .eq('post_id', selectedForum.id)
          .order('created_at', { ascending: true });
        
        if (commentsError) {
          console.error('Error fetching comments:', commentsError);
          return;
        }
        
        // Get all unique author IDs from comments
        const authorIds = commentsData ? [...new Set(commentsData.map(comment => comment.author_id))] : [];
        
        // Fetch comment authors data
        const authorMap = {};
        if (authorIds.length > 0) {
          const { data: authorsData, error: authorsError } = await supabase
            .from('profiles')
            .select('id, name')
            .in('id', authorIds);
          
          if (authorsError) {
            console.error('Error fetching comment authors:', authorsError);
          }
          
          // Create a map of author IDs to author names
          authorsData?.forEach(author => {
            authorMap[author.id] = author.name;
          });
        }
        
        // Format comments with author names
        const formattedComments = commentsData ? commentsData.map(comment => ({
          id: comment.id,
          content: comment.content,
          authorId: comment.author_id,
          authorName: authorMap[comment.author_id] || 'Unknown User',
          createdAt: new Date(comment.created_at),
          updatedAt: new Date(comment.updated_at)
        })) : [];

        setComments(formattedComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
        toast.error('Failed to load comments');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchComments();
  }, [selectedForum]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      toast.error('You must be logged in to comment');
      return;
    }
    
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    if (!selectedForum) {
      toast.error('No forum selected');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data: commentData, error } = await supabase
        .from('forum_comments')
        .insert({
          post_id: selectedForum.id,
          content: newComment.trim(),
          author_id: user.id
        })
        .select('id, content, created_at, updated_at')
        .single();
      
      if (error) {
        throw error;
      }
      
      // Add the new comment to the list
      const newCommentObj = {
        id: commentData.id,
        content: commentData.content,
        authorId: user.id,
        authorName: user.name,
        createdAt: new Date(commentData.created_at),
        updatedAt: new Date(commentData.updated_at)
      };
      
      setComments(prevComments => [...prevComments, newCommentObj]);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedForum) {
    return (
      <Card className="h-full flex items-center justify-center p-8 text-center">
        <CardContent>
          <p className="text-muted-foreground">Select a forum topic from the left to view the discussion.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <div>
            <CardTitle className="text-2xl">{selectedForum.title}</CardTitle>
            <p className="text-muted-foreground mt-1">
              Posted by {selectedForum.authorName} • {formatDate(selectedForum.createdAt)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              <span>{selectedForum.likesCount}</span>
            </Button>
            <div className="flex items-center text-muted-foreground">
              <MessageSquare className="mr-1 h-4 w-4" />
              <span>{comments.length}</span>
            </div>
          </div>
        </div>
        {selectedForum.categoryId && (
          <Badge variant="outline" className="mt-2">
            {selectedForum.categoryId}
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="prose max-w-none">
          <p className="whitespace-pre-wrap">{selectedForum.content}</p>
        </div>
        
        <Separator className="my-6" />
        
        <h3 className="font-semibold text-lg">Comments ({comments.length})</h3>
        
        {isLoading ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            {comments.map(comment => (
              <Card key={comment.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{comment.authorName}</span>
                    <span className="text-sm text-muted-foreground">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="whitespace-pre-wrap">{comment.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="w-full space-y-2">
            <Textarea 
              placeholder="Add a comment..." 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full"
            />
            <Button 
              type="submit" 
              disabled={isSubmitting || !newComment.trim()}
              className="ml-auto"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </form>
        ) : (
          <p className="text-center text-muted-foreground w-full">
            Please log in to comment.
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default ForumDiscussion;
