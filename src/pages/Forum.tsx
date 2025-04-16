
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
import { MessageSquare, ThumbsUp, Search, Plus } from 'lucide-react';

// Sample data
const CATEGORIES: ForumCategory[] = [
  {
    id: '1',
    name: 'General Discussion',
    description: 'General family discussions and topics',
    postsCount: 15
  },
  {
    id: '2',
    name: 'Events & Meetups',
    description: 'Upcoming family events and gatherings',
    postsCount: 8
  },
  {
    id: '3',
    name: 'Support & Advice',
    description: 'Ask for help and share advice',
    postsCount: 12
  },
  {
    id: '4',
    name: 'Recipes & Cooking',
    description: 'Share family recipes and cooking tips',
    postsCount: 10
  },
  {
    id: '5',
    name: 'Family History',
    description: 'Discussions about family history and genealogy',
    postsCount: 5
  }
];

const POSTS: ForumPost[] = [
  {
    id: '1',
    categoryId: '1',
    title: 'Welcome to the SunderlandFamily Hub!',
    content: 'Welcome everyone to our new family hub! Let\'s use this space to stay connected.',
    authorId: '1',
    authorName: 'Admin User',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15'),
    likesCount: 25,
    commentsCount: 12
  },
  {
    id: '2',
    categoryId: '2',
    title: 'Summer Reunion Planning Thread',
    content: 'Let\'s start planning our summer reunion for July. Who\'s available?',
    authorId: '3',
    authorName: 'Premium User',
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date('2023-02-21'),
    likesCount: 18,
    commentsCount: 32
  },
  {
    id: '3',
    categoryId: '3',
    title: 'Need advice for a family member',
    content: 'I have a situation with a relative and need some advice from the family.',
    authorId: '2',
    authorName: 'Regular User',
    createdAt: new Date('2023-03-05'),
    updatedAt: new Date('2023-03-05'),
    likesCount: 7,
    commentsCount: 15
  },
  {
    id: '4',
    categoryId: '4',
    title: 'Grandma\'s secret apple pie recipe',
    content: 'I finally got permission to share Grandma\'s famous apple pie recipe!',
    authorId: '3',
    authorName: 'Premium User',
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2023-03-10'),
    likesCount: 42,
    commentsCount: 8
  },
  {
    id: '5',
    categoryId: '5',
    title: 'Old family photos discovered',
    content: 'I found a box of old family photos from the 1940s. Would love to share!',
    authorId: '1',
    authorName: 'Admin User',
    createdAt: new Date('2023-04-15'),
    updatedAt: new Date('2023-04-15'),
    likesCount: 31,
    commentsCount: 23
  }
];

const Forum = () => {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>(POSTS);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPosts(POSTS);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredPosts(POSTS.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.content.toLowerCase().includes(query) ||
        post.authorName.toLowerCase().includes(query)
      ));
    }
  }, [searchQuery]);
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Community Forum</h1>
        {isAuthenticated && (
          <Button className="bg-family-green hover:bg-green-600">
            <Plus className="mr-2 h-4 w-4" />
            Create New Post
          </Button>
        )}
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
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts found matching your search.</p>
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
                      {CATEGORIES.find(c => c.id === post.categoryId)?.name}
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map(category => (
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Forum;
