
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, ThumbsUp } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/lib/supabase';
import { ForumPost, ForumCategory, ForumComment } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const ForumPostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [category, setCategory] = useState<ForumCategory | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPostData = async () => {
      if (!postId) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch post data
        const { data: postData, error: postError } = await supabase
          .from('forum_posts')
          .select(`
            id,
            title,
            content,
            created_at,
            updated_at,
            category_id,
            author_id
          `)
          .eq('id', postId)
          .single();
        
        if (postError) {
          console.error('Error fetching post:', postError);
          setNotFound(true);
          setIsLoading(false);
          return;
        }
        
        if (!postData) {
          setNotFound(true);
          setIsLoading(false);
          return;
        }
        
        // Fetch author data
        const { data: authorData, error: authorError } = await supabase
          .from('profiles')
          .select('id, name')
          .eq('id', postData.author_id)
          .single();
        
        if (authorError) {
          console.error('Error fetching author:', authorError);
        }
        
        // Fetch category data
        if (postData.category_id) {
          const { data: categoryData, error: categoryError } = await supabase
            .from('forum_categories')
            .select('id, name, description')
            .eq('id', postData.category_id)
            .single();
          
          if (!categoryError && categoryData) {
            setCategory({
              id: categoryData.id,
              name: categoryData.name,
              description: categoryData.description,
              postsCount: 0
            });
          }
        }
        
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
          .eq('post_id', postId)
          .order('created_at', { ascending: true });
        
        if (commentsError) {
          console.error('Error fetching comments:', commentsError);
        }
        
        // Get all unique author IDs from comments
        const commentAuthorIds = commentsData ? [...new Set(commentsData.map(comment => comment.author_id))] : [];
        
        // Fetch comment authors data
        const authorMap = {};
        if (commentAuthorIds.length > 0) {
          const { data: commentAuthorsData, error: commentAuthorsError } = await supabase
            .from('profiles')
            .select('id, name')
            .in('id', commentAuthorIds);
          
          if (commentAuthorsError) {
            console.error('Error fetching comment authors:', commentAuthorsError);
          }
          
          // Create a map of author IDs to author names
          commentAuthorsData?.forEach(author => {
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

        // Fetch post likes count
        const { count: likesCount, error: likesCountError } = await supabase
          .from('forum_post_likes')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', postId);
        
        if (likesCountError) {
          console.error('Error fetching likes count:', likesCountError);
        }

        // Check if current user has liked this post
        if (user) {
          const { data: userLike, error: userLikeError } = await supabase
            .from('forum_post_likes')
            .select('id')
            .eq('post_id', postId)
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (userLikeError) {
            console.error('Error checking if user liked post:', userLikeError);
          }
          
          setHasLiked(!!userLike);
        }
        
        // Format post with author data and counts
        const formattedPost: ForumPost = {
          id: postData.id,
          categoryId: postData.category_id,
          title: postData.title,
          content: postData.content,
          authorId: postData.author_id,
          authorName: authorData?.name || 'Unknown User',
          authorAvatar: undefined,
          createdAt: new Date(postData.created_at),
          updatedAt: new Date(postData.updated_at),
          likesCount: likesCount || 0,
          commentsCount: formattedComments.length
        };
        
        setPost(formattedPost);
        setComments(formattedComments);
        setNotFound(false);
      } catch (error) {
        console.error('Error fetching post data:', error);
        toast.error('Failed to load post');
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPostData();
  }, [postId, navigate, user]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
    
    setIsSubmitting(true);
    
    try {
      const { data: commentData, error } = await supabase
        .from('forum_comments')
        .insert({
          post_id: postId,
          content: newComment.trim(),
          author_id: user.id
        })
        .select('id, content, created_at, updated_at')
        .single();
      
      if (error) {
        throw error;
      }
      
      // Add the new comment to the list
      const newCommentObj: ForumComment = {
        id: commentData.id,
        content: commentData.content,
        authorId: user.id,
        authorName: user.name,
        createdAt: new Date(commentData.created_at),
        updatedAt: new Date(commentData.updated_at)
      };
      
      setComments(prevComments => [...prevComments, newCommentObj]);
      setNewComment('');
      
      // Update comment count on post
      if (post) {
        setPost({
          ...post,
          commentsCount: post.commentsCount + 1
        });
      }
      
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikePost = async () => {
    if (!isAuthenticated || !user) {
      toast.error('You must be logged in to like posts');
      return;
    }
    
    if (!post) return;
    
    setIsLiking(true);
    
    try {
      if (hasLiked) {
        // Unlike the post
        const { error } = await supabase
          .from('forum_post_likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        setHasLiked(false);
        setPost({
          ...post,
          likesCount: Math.max(0, post.likesCount - 1)
        });
        
        toast.success('Post unliked');
      } else {
        // Like the post
        const { error } = await supabase
          .from('forum_post_likes')
          .insert({
            post_id: post.id,
            user_id: user.id
          });
        
        if (error) throw error;
        
        setHasLiked(true);
        setPost({
          ...post,
          likesCount: post.likesCount + 1
        });
        
        toast.success('Post liked');
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error);
      toast.error('Failed to like/unlike post');
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="container py-8 animate-fade-in">
      <Button variant="ghost" className="mb-6" asChild>
        <Link to="/forum" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Forum
        </Link>
      </Button>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : notFound ? (
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">The requested post could not be found or may have been removed.</p>
          <Button asChild>
            <Link to="/forum">Return to Forum</Link>
          </Button>
        </div>
      ) : post ? (
        <div className="space-y-6">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                <span>Posted by {post.authorName}</span>
                <span>•</span>
                <span>{formatDate(post.createdAt)}</span>
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
                <span>{comments.length}</span>
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
                        <span className="text-sm text-muted-foreground">{formatDate(comment.createdAt)}</span>
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
        </div>
      ) : null}
    </div>
  );
};

export default ForumPostPage;
