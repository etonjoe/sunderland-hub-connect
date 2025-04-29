import React, { useState, useEffect } from 'react';
import { MessageCircle, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForumLike } from '../hooks/useForumLike';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ForumPost } from '@/types'; // Import ForumPost from the central types file

interface Category {
  id: string;
  name: string;
}
interface PostCardProps {
  post: ForumPost;
  categories: Category[];
  formatDate: (date: Date) => string;
}

type ForumComment = {
  id: string;
  author_id: string;
  content: string;
  created_at: string;
  author_name?: string;
};

const PostCard = ({ post, categories, formatDate }: PostCardProps) => {
  const { user, isAuthenticated } = useAuth();
  const { isLiked, likesCount, toggleLike, canLike } = useForumLike(post.id);

  // Comments state/logic
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [commentValue, setCommentValue] = useState('');
  const [isSending, setIsSending] = useState(false);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('forum_comments')
      .select(`
        id, author_id, content, created_at
      `)
      .eq('post_id', post.id)
      .order('created_at', { ascending: true });
    
    if (error) {
      toast.error('Failed to load comments');
      setComments([]);
      return;
    }
    
    // Get all author IDs
    const authorIds = data.map(comment => comment.author_id);
    
    // Fetch author names
    const { data: authorData, error: authorError } = await supabase
      .from('profiles')
      .select('id, name')
      .in('id', authorIds);
    
    if (authorError) {
      console.error('Error fetching author data:', authorError);
    }
    
    // Create a map of author IDs to names
    const authorMap: Record<string, string> = {};
    if (authorData) {
      authorData.forEach(author => {
        authorMap[author.id] = author.name;
      });
    }
    
    // Map comments with author names
    const mappedComments = data.map((c) => ({
      ...c,
      author_name: authorMap[c.author_id] || 'Unknown',
    }));
    
    setComments(mappedComments);
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [post.id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || commentValue.trim().length === 0) {
      toast.error('Please sign in and enter a comment');
      return;
    }
    setIsSending(true);
    const { error } = await supabase.from('forum_comments').insert({
      post_id: post.id,
      author_id: user.id,
      content: commentValue,
    });
    if (error) {
      toast.error('Could not add comment');
    } else {
      setCommentValue('');
      fetchComments();
      toast.success('Comment added!');
    }
    setIsSending(false);
  };

  // Find category name, if present
  const category = categories.find(c => c.id === post.categoryId);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{post.title}</CardTitle>
            <div className="text-muted-foreground text-sm">
              {category ? <span>In {category.name}</span> : null} • by {post.authorName} • {formatDate(post.createdAt)}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleLike} disabled={!canLike} aria-label="Like post">
              <Heart
                className={`h-5 w-5 transition-colors ${
                  isLiked
                    ? 'text-red-500 fill-red-500'
                    : 'text-muted-foreground hover:text-red-400'
                }`}
                fill={isLiked ? '#ef4444' : 'none'}
              />
            </Button>
            <span className="text-sm">{likesCount}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-wrap">{post.content}</div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-2 pt-2 border-t">
        <div className="flex items-center gap-2 mb-1">
          <MessageCircle className="h-4 w-4" />
          <span className="font-medium text-sm">Comments ({comments.length})</span>
        </div>
        <div className="space-y-3">
          {comments.length === 0 &&
            <div className="text-muted-foreground text-sm">No comments yet</div>
          }
          {comments.map((c) => (
            <div key={c.id} className="rounded px-3 py-2 bg-muted text-sm">
              <div>
                <span className="font-medium">{c.author_name || 'Unknown'}</span>: {c.content}
              </div>
              <div className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
        <form onSubmit={handleAddComment} className="flex flex-row gap-2 mt-2">
          <Input
            type="text"
            placeholder={user ? 'Add a comment...' : 'Sign in to comment'}
            value={commentValue}
            onChange={e => setCommentValue(e.target.value)}
            disabled={!user || isSending}
            className="flex-1"
          />
          <Button type="submit" disabled={!user || isSending || !commentValue.trim()}>
            Post
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
