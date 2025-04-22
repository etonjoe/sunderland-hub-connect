
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ForumPost, ForumCategory } from '@/types';

export const useForumData = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPosts = async () => {
    setIsLoadingPosts(true);
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('forum_posts')
        .select(`
          id,
          title,
          content,
          created_at,
          updated_at,
          category_id,
          author_id
        `)
        .order('created_at', { ascending: false });
      
      if (postsError) throw postsError;
      
      const authorIds = [...new Set(postsData.map(post => post.author_id))];
      const { data: authorsData, error: authorsError } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', authorIds);
      
      if (authorsError) throw authorsError;
      
      const authorMap = {};
      authorsData.forEach(author => {
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
      
      const formattedCategories: ForumCategory[] = data.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        postsCount: 0
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

  return {
    posts,
    categories,
    isLoadingPosts,
    isLoadingCategories,
    filteredPosts,
    searchQuery,
    setSearchQuery,
    fetchPosts,
    fetchCategories
  };
};
