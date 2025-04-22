
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import ForumHeader from '@/features/forum/components/ForumHeader';
import SearchBar from '@/features/forum/components/SearchBar';
import PostCard from '@/features/forum/components/PostCard';
import CategoryCard from '@/features/forum/components/CategoryCard';
import { useForumData } from '@/features/forum/hooks/useForumData';
import { ForumPost as GlobalForumPost } from '@/types'; // Renamed import to avoid conflicts

// Local type definition that matches how we're using it in this component
type ForumPost = GlobalForumPost;

const Forum = () => {
  const { isAuthenticated, user } = useAuth();
  const {
    filteredPosts,
    categories,
    isLoadingPosts,
    isLoadingCategories,
    searchQuery,
    setSearchQuery,
    fetchPosts,
    fetchCategories
  } = useForumData();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container py-8 animate-fade-in">
      <ForumHeader
        isAuthenticated={isAuthenticated}
        userRole={user?.role}
        onPostCreated={fetchPosts}
        onCategoryCreated={fetchCategories}
      />
      
      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <Tabs defaultValue="posts">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="posts">Recent Posts</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="space-y-6">
          {isLoadingPosts ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading posts...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts found matching your search.</p>
            </div>
          ) : (
            filteredPosts.map(post => (
              <PostCard 
                key={post.id}
                post={post}
                categories={categories}
                formatDate={formatDate}
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="categories">
          {isLoadingCategories ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No categories found.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categories.map(category => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Forum;
