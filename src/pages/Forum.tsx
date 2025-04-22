
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/contexts/AuthContext';
import { ForumCategory, ForumPost } from '@/types';
import { MessageSquare, ThumbsUp, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import CreateForumPost from '@/components/forum/CreateForumPost';
import CreateForumCategory from '@/components/forum/CreateForumCategory';

const Forum = () => {
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>([]);
  
  const fetchPosts = async () => {
    setIsLoadingPosts(true);
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`
          id,
          title,
          content,
          created_at,
          updated_at,
          category_id,
          author_id,
          profiles:profiles!author_id(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform data into ForumPost objects
      const formattedPosts: ForumPost[] = data.map(post => ({
        id: post.id,
        categoryId: post.category_id,
        title: post.title,
        content: post.content,
        authorId: post.author_id,
        authorName: post.profiles?.name || 'Unknown User',
        authorAvatar: undefined,
        createdAt: new Date(post.created_at),
        updatedAt: new Date(post.updated_at),
        likesCount: 0, // We'd need another query to get this
        commentsCount: 0 // We'd need another query to get this
      }));
      
      setPosts(formattedPosts);
      setFilteredPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load forum posts');
    } finally {
      setIsLoadingPosts(false);
    }
  };
  
  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const { data, error } = await supabase
        .from('forum_categories')
        .select('id, name, description');
      
      if (error) throw error;
      
      // Transform data into ForumCategory objects
      const formattedCategories: ForumCategory[] = data.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        postsCount: 0 // We'd need a count query to get this
      }));
      
      setCategories(formattedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load forum categories');
    } finally {
      setIsLoadingCategories(false);
    }
  };
  
  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);
  
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
  
  const handlePostCreated = () => {
    fetchPosts();
  };

  const handleCategoryCreated = () => {
    fetchCategories();
  };
  
  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Community Forum</h1>
        <div className="flex gap-2">
          {user?.role === 'admin' && (
            <CreateForumCategory onCategoryCreated={handleCategoryCreated} />
          )}
          {isAuthenticated && (
            <CreateForumPost onPostCreated={handlePostCreated} />
          )}
        </div>
      </div>
      
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search forum posts..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
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
              {isAuthenticated && (
                <div className="mt-4">
                  <CreateForumPost onPostCreated={handlePostCreated} />
                </div>
              )}
            </div>
          ) : (
            filteredPosts.map(post => (
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
            ))
          )}
        </TabsContent>
        
        <TabsContent value="categories">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Forum Categories</h2>
            {user?.role === 'admin' && (
              <CreateForumCategory onCategoryCreated={handleCategoryCreated} />
            )}
          </div>
          
          {isLoadingCategories ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No categories found. Create a category to get started.</p>
              {user?.role === 'admin' && (
                <div className="mt-4">
                  <CreateForumCategory onCategoryCreated={handleCategoryCreated} />
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categories.map(category => (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-family-green">
                      <Link to={`/forum/category/${category.id}`} className="hover:underline">
                        {category.name}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{category.description}</p>
                  </CardContent>
                  <Separator />
                  <CardFooter className="pt-3 flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      {category.postsCount} posts
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/forum/category/${category.id}`}>
                        View
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Forum;
