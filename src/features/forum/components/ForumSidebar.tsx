
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ForumPost, ForumCategory } from '@/types';

interface ForumSidebarProps {
  posts: ForumPost[];
  categories: ForumCategory[];
  formatDate: (date: Date) => string;
  onForumSelect: (post: ForumPost) => void;
  selectedForumId: string | null;
}

const ForumSidebar = ({
  posts,
  categories,
  formatDate,
  onForumSelect,
  selectedForumId
}: ForumSidebarProps) => {
  // Function to get category name from ID
  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return "General";
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || "General";
  };

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <Card 
          key={post.id}
          className={`cursor-pointer transition-colors hover:bg-muted/50 ${
            selectedForumId === post.id ? 'border-primary bg-muted' : ''
          }`}
          onClick={() => onForumSelect(post)}
        >
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg truncate">{post.title}</h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge variant="outline">{getCategoryName(post.categoryId)}</Badge>
              <span className="text-xs text-muted-foreground">
                {formatDate(post.createdAt)}
              </span>
              <span className="text-xs text-muted-foreground">
                by {post.authorName}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ForumSidebar;
