
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useForumCategory } from '@/features/forum/hooks/useForumCategory';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/features/forum/utils/formatters';
import ForumHeader from '@/features/forum/components/ForumHeader';
import SearchBar from '@/features/forum/components/SearchBar';
import CategoryHeader from '@/features/forum/components/CategoryHeader';
import CategoryLoading from '@/features/forum/components/CategoryLoading';
import CategoryNotFound from '@/features/forum/components/CategoryNotFound';
import PostsList from '@/features/forum/components/PostsList';

const ForumCategoryPage = () => {
  const { categoryId } = useParams();
  const { isAuthenticated, user } = useAuth();
  
  const {
    category,
    filteredPosts,
    isLoading,
    notFound,
    searchQuery,
    setSearchQuery,
    fetchCategoryData
  } = useForumCategory(categoryId);

  const fetchPosts = fetchCategoryData;
  const fetchCategories = () => {}; // Placeholder since we only need this for ForumHeader

  return (
    <div className="container py-8 animate-fade-in">
      <Button variant="ghost" className="mb-6" asChild>
        <Link to="/forum" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Categories
        </Link>
      </Button>
      
      {isLoading ? (
        <CategoryLoading />
      ) : notFound ? (
        <CategoryNotFound />
      ) : category ? (
        <div className="space-y-6">
          <CategoryHeader category={category} />

          <ForumHeader
            isAuthenticated={isAuthenticated}
            userRole={user?.role}
            onPostCreated={fetchPosts}
            onCategoryCreated={fetchCategories}
            defaultCategoryId={category.id}
          />
          
          <SearchBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          
          <PostsList 
            posts={filteredPosts} 
            categories={[category]} 
            searchQuery={searchQuery}
            formatDate={formatDate}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ForumCategoryPage;
