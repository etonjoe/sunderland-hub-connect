
import { ForumPost, ForumCategory } from '@/types';
import PostCard from '@/features/forum/components/PostCard';

interface PostsListProps {
  posts: ForumPost[];
  categories: ForumCategory[];
  searchQuery: string;
  formatDate: (date: Date) => string;
}

const PostsList = ({ posts, categories, searchQuery, formatDate }: PostsListProps) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        {searchQuery ? (
          <p className="text-muted-foreground">No posts found matching your search.</p>
        ) : (
          <p className="text-muted-foreground">No posts in this category yet. Be the first to create one!</p>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {posts.map(post => (
        <PostCard 
          key={post.id}
          post={post}
          categories={categories}
          formatDate={formatDate}
        />
      ))}
    </div>
  );
};

export default PostsList;
