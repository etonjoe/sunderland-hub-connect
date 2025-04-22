
import { Link } from 'react-router-dom';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { ForumPost, ForumCategory } from '@/types';

interface PostCardProps {
  post: ForumPost;
  categories: ForumCategory[];
  formatDate: (date: Date) => string;
}

const PostCard = ({ post, categories, formatDate }: PostCardProps) => {
  return (
    <Card key={post.id} className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold text-family-blue">
            <Link to={`/forum/post/${post.id}`} className="hover:underline">
              {post.title}
            </Link>
          </CardTitle>
          <Badge variant="outline" className="ml-2">
            {categories.find(c => c.id === post.categoryId)?.name || 'Uncategorized'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{post.content.substring(0, 150)}...</p>
      </CardContent>
      <CardFooter className="pt-1 flex flex-col items-start sm:flex-row sm:justify-between">
        <div className="text-sm text-muted-foreground mb-2 sm:mb-0">
          Posted by {post.authorName} on {formatDate(post.createdAt)}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-muted-foreground text-sm">
            <ThumbsUp className="mr-1 h-4 w-4" />
            <span>{post.likesCount}</span>
          </div>
          <div className="flex items-center text-muted-foreground text-sm">
            <MessageSquare className="mr-1 h-4 w-4" />
            <span>{post.commentsCount}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
