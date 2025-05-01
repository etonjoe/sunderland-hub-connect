
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useForumPost } from '@/features/forum/hooks/useForumPost';
import PostLoading from '@/features/forum/components/PostLoading';
import PostNotFound from '@/features/forum/components/PostNotFound';
import PostContent from '@/features/forum/components/PostContent';
import CommentsSection from '@/features/forum/components/CommentsSection';

const ForumPostPage = () => {
  const { postId } = useParams();
  const { user, isAuthenticated } = useAuth();
  
  const {
    post,
    category,
    comments,
    newComment,
    setNewComment,
    isSubmitting,
    isLiking,
    hasLiked,
    isLoading,
    notFound,
    handleCommentSubmit,
    handleLikePost
  } = useForumPost(postId, user);

  return (
    <div className="container py-8 animate-fade-in">
      <Button variant="ghost" className="mb-6" asChild>
        <Link to="/forum" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Forum
        </Link>
      </Button>
      
      {isLoading ? (
        <PostLoading />
      ) : notFound ? (
        <PostNotFound />
      ) : post ? (
        <div className="space-y-6">
          <PostContent 
            post={post}
            category={category}
            hasLiked={hasLiked}
            isLiking={isLiking}
            isAuthenticated={isAuthenticated}
            commentsCount={comments.length}
            handleLikePost={handleLikePost}
          />
          
          <CommentsSection
            comments={comments}
            isAuthenticated={isAuthenticated}
            newComment={newComment}
            isSubmitting={isSubmitting}
            setNewComment={setNewComment}
            handleCommentSubmit={handleCommentSubmit}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ForumPostPage;
