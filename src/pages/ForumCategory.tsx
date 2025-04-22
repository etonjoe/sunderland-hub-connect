import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from '@/lib/supabase';
import { ForumPost, ForumCategory as ForumCategoryType } from '@/types';
import { toast } from 'sonner';
import PostCard from '@/features/forum/components/PostCard';
import SearchBar from '@/features/forum/components/SearchBar';
import ForumHeader from '@/features/forum/components/ForumHeader';
import { useAuth } from '@/contexts/AuthContext';

const ForumCategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState<ForumCategoryType | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!categoryId) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data: categoryData, error: categoryError } = await supabase
          .from('forum_categories')
          .select('id, name, description')
          .eq('id', categoryId)
          .single();
        
        if (categoryError || !categoryData) {
          console.error('Error fetching category:', categoryError);
          setNotFound(true);
          setIsLoading(false);
          return;
        }
        
        const formattedCategory: ForumCategoryType = {
          id: categoryData.id,
          name: categoryData.name,
          description: categoryData.description,
          postsCount: 0
        };
        
        const { data: postsData, error: postsError } = await supabase
          .from('forum_posts')
          .select(`
            id,
            title,
            content,
            created_at,
            updated_at,
            author_id,
            category_id
          `)
          .eq('category_id', categoryId)
          .order('created_at', { ascending: false });
        
        if (postsError) {
          console.error('Error fetching posts:', postsError);
          toast.error('Failed to load posts');
          setPosts([]);
          setFilteredPosts([]);
        } else {
          const authorIds = [...new Set(postsData.map(post => post.author_id))];
          
          const { data: authorsData, error: authorsError } = await supabase
            .from('profiles')
            .select('id, name')
            .in('id', authorIds);
          
          if (authorsError) {
            console.error('Error fetching authors:', authorsError);
          }
          
          const authorMap = {};
          authorsData?.forEach(author => {
            authorMap[author.id] = author.name;
          });
          
          const formattedPosts: ForumPost[] = postsData.map(post => ({
            id: post.id,
            categoryId: post.category_id,
            title: post.title,
            content: post.content,
            authorId: post.author_id,
            authorName: authorMap[post.author_id] || 'Unknown User',
            authorAvatar: undefined,
            createdAt: new Date(post.created_at),
            updatedAt: new Date(post.updated_at),
            likesCount: 0,
            commentsCount: 0
          }));
          
          formattedCategory.postsCount = formattedPosts.length;
          
          setPosts(formattedPosts);
          setFilteredPosts(formattedPosts);
        }
        
        setCategory(formattedCategory);
        setNotFound(false);
      } catch (error) {
        console.error('Error fetching category data:', error);
        toast.error('Failed to load category');
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategoryData();
  }, [categoryId]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPosts(posts);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredPosts(posts.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.content.toLowerCase().includes(query) ||
        post.authorName.toLowerCase().includes(query)
      ));
    }
  }, [searchQuery, posts]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const fetchPosts = async () => {
    if (!categoryId) return;
    
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`
          id,
          title,
          content,
          created_at,
          updated_at,
          author_id,
          category_id
        `)
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const authorIds = [...new Set(data.map(post => post.author_id))];
      
      const { data: authorsData, error: authorsError } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', authorIds);
      
      if (authorsError) throw authorsError;
      
      const authorMap = {};
      authorsData.forEach(author => {
        authorMap[author.id] = author.name;
      });
      
      const formattedPosts: ForumPost[] = data.map(post => ({
        id: post.id,
        categoryId: post.category_id,
        title: post.title,
        content: post.content,
        authorId: post.author_id,
        authorName: authorMap[post.author_id] || 'Unknown User',
        authorAvatar: undefined,
        createdAt: new Date(post.created_at),
        updatedAt: new Date(post.updated_at),
        likesCount: 0,
        commentsCount: 0
      }));
      
      setPosts(formattedPosts);
      setFilteredPosts(formattedPosts);
      
      if (category) {
        setCategory({
          ...category,
          postsCount: formattedPosts.length
        });
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to reload posts');
    }
  };

  const fetchCategories = async () => {
    // This is a placeholder since we're only concerned with one category
    // But we need to pass this to ForumHeader
  };

  return (
    <div className="container py-8 animate-fade-in">
      <Button variant="ghost" className="mb-6" asChild>
        <Link to="/forum" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Categories
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
          <h1 className="text-2xl font-bold mb-2">Category Not Found</h1>
          <p className="text-muted-foreground mb-6">The requested category could not be found or may have been removed.</p>
          <Button asChild>
            <Link to="/forum">Return to Forum</Link>
          </Button>
        </div>
      ) : category ? (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
            <p className="text-muted-foreground mb-4">{category.description}</p>
            <Badge variant="outline" className="mb-6">
              {category.postsCount} {category.postsCount === 1 ? 'post' : 'posts'}
            </Badge>
          </div>

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
          
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              {searchQuery ? (
                <p className="text-muted-foreground">No posts found matching your search.</p>
              ) : (
                <p className="text-muted-foreground">No posts in this category yet. Be the first to create one!</p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPosts.map(post => (
                <PostCard 
                  key={post.id}
                  post={post}
                  categories={[category]}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ForumCategoryPage;
