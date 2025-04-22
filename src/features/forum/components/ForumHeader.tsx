
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import CreateForumPost from '@/components/forum/CreateForumPost';
import CreateForumCategory from '@/components/forum/CreateForumCategory';

interface ForumHeaderProps {
  isAuthenticated: boolean;
  userRole?: string;
  onPostCreated: () => void;
  onCategoryCreated: () => void;
}

const ForumHeader = ({ isAuthenticated, userRole, onPostCreated, onCategoryCreated }: ForumHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <h1 className="text-3xl font-bold mb-4 sm:mb-0">Community Forum</h1>
      <div className="flex gap-2">
        {userRole === 'admin' && (
          <CreateForumCategory onCategoryCreated={onCategoryCreated} />
        )}
        {isAuthenticated && (
          <CreateForumPost onPostCreated={onPostCreated} />
        )}
      </div>
    </div>
  );
};

export default ForumHeader;
