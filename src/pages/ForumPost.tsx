
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, ThumbsUp } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from '@/integrations/supabase/client';
import { ForumPost, ForumCategory, ForumComment } from '@/types';
import { toast } from 'sonner';

const ForumPostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [category, setCategory] = useState<ForumCategory | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPostData = async () => {
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
        
        if (postError) throw postError;
        
        // Fetch author data
        const { data: authorData, error: authorError } = await supabase
          .from('profiles')
          .select('id, name')
          .eq('id', postData.author_id)
          .single();
        
        if (authorError) throw authorError;
        
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
        
        if (commentsError) throw commentsError;
        
        // Get all unique author IDs from comments
        const commentAuthorIds = [...new Set(commentsData.map(comment => comment.author_id))];
        
        // Fetch comment authors data
        const { data: commentAuthorsData, error: commentAuthorsError } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', commentAuthorIds);
        
        if (commentAuthorsError) throw commentAuthorsError;
        
        // Create a map of author IDs to author names
        const authorMap = {};
        commentAuthorsData?.forEach(author => {
          authorMap[author.id] = author.name;
        });
        
        // Format comments with author names
        const formattedComments = commentsData.map(comment => ({
          id: comment.id,
          content: comment.content,
          authorId: comment.author_id,
          authorName: authorMap[comment.author_id] || 'Unknown User',
          createdAt: new Date(comment.created_at),
          updatedAt: new Date(comment.updated_at)
        }));
        
        // Format post with author data
        const formattedPost: ForumPost = {
          id: postData.id,
          categoryId: postData.category_id,
          title: postData.title,
          content: postData.content,
          authorId: postData.author_id,
          authorName: authorData.name || 'Unknown User',
          authorAvatar: undefined,
          createdAt: new Date(postData.created_at),
          updatedAt: new Date(postData.updated_at),
          likesCount: 0,
          commentsCount: formattedComments.length
        };
        
        setPost(formattedPost);
        setComments(formattedComments);
      } catch (error) {
        console.error('Error fetching post data:', error);
        toast.error('Failed to load post');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (postId) {
      fetchPostData();
    }
  }, [postId]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
              <div className="flex items-center text-muted-foreground">
                <ThumbsUp className="mr-1 h-4 w-4" />
                <span>{post.likesCount}</span>
              </div>
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
      ) : (
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">The requested post could not be found or may have been removed.</p>
          <Button asChild>
            <Link to="/forum">Return to Forum</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ForumPostPage;
