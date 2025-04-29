
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import ForumHeader from '@/features/forum/components/ForumHeader';
import SearchBar from '@/features/forum/components/SearchBar';
import PostCard from '@/features/forum/components/PostCard';
import CategoryCard from '@/features/forum/components/CategoryCard';
import { useForumData } from '@/features/forum/hooks/useForumData';
import { ForumPost } from '@/types';
import ForumSidebar from '@/features/forum/components/ForumSidebar';
import ForumDiscussion from '@/features/forum/components/ForumDiscussion';

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

  const [selectedForumId, setSelectedForumId] = useState<string | null>(null);
  const [selectedForum, setSelectedForum] = useState<ForumPost | null>(null);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleForumSelect = (post: ForumPost) => {
    setSelectedForumId(post.id);
    setSelectedForum(post);
  };

  return (
    <div className="container py-8 animate-fade-in">
      <ForumHeader
        isAuthenticated={isAuthenticated}
        userRole={user?.role}
        onPostCreated={fetchPosts}
        onCategoryCreated={fetchCategories}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left side - Forum list */}
        <div className="lg:col-span-1">
          <SearchBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          
          <Tabs defaultValue="posts" className="mt-4">
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
                <ForumSidebar 
                  posts={filteredPosts}
                  categories={categories}
                  formatDate={formatDate}
                  onForumSelect={handleForumSelect}
                  selectedForumId={selectedForumId}
                />
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
                <div className="grid gap-6">
                  {categories.map(category => (
                    <CategoryCard key={category.id} category={category} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right side - Forum discussion */}
        <div className="lg:col-span-2">
          <ForumDiscussion
            selectedForum={selectedForum}
            isAuthenticated={isAuthenticated}
            user={user}
            formatDate={formatDate}
          />
        </div>
      </div>
    </div>
  );
};

export default Forum;
