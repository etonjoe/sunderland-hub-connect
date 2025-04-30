
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ForumPost, ForumCategory } from '@/types';
import { toast } from 'sonner';

export const useForumCategory = (categoryId: string | undefined) => {
  const [category, setCategory] = useState<ForumCategory | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCategoryData = async () => {
    if (!categoryId) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      console.log('Fetching category data for categoryId:', categoryId);
      
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
      
      console.log('Category data fetched:', categoryData);
      
      const formattedCategory: ForumCategory = {
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
          title: post.title,
          content: post.content,
          categoryId: post.category_id || undefined,
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

  useEffect(() => {
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

  return {
    category,
    posts,
    filteredPosts,
    isLoading,
    notFound,
    searchQuery,
    setSearchQuery,
    fetchCategoryData
  };
};
