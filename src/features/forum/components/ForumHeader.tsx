
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import CreateForumPost from "@/components/forum/CreateForumPost";
import CreateForumCategory from "@/components/forum/CreateForumCategory";
import { ForumCategory } from '@/types';
import { supabase } from '@/lib/supabase';

interface ForumHeaderProps {
  isAuthenticated: boolean;
  userRole?: string;
  onPostCreated: () => void;
  onCategoryCreated: () => void;
  defaultCategoryId?: string;
}

const ForumHeader = ({ 
  isAuthenticated, 
  userRole, 
  onPostCreated, 
  onCategoryCreated,
  defaultCategoryId
}: ForumHeaderProps) => {
  const [categories, setCategories] = useState<ForumCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('forum_categories')
        .select('id, name, description');
      
      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }
      
      setCategories(data.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        postsCount: 0
      })));
    };
    
    fetchCategories();
  }, []);
  
  return (
    <div className="flex flex-wrap justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Community Forum</h1>
        <p className="text-muted-foreground max-w-2xl">Connect with other families, share experiences, and ask questions in our community forum.</p>
      </div>
      
      <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
        {isAuthenticated && (
          <CreateForumPost 
            categories={categories} 
            onPostCreated={onPostCreated}
            defaultCategoryId={defaultCategoryId}
          />
        )}
        
        {userRole === 'admin' && (
          <CreateForumCategory onCategoryCreated={onCategoryCreated} />
        )}
      </div>
    </div>
  );
};

export default ForumHeader;
