
import { Badge } from "@/components/ui/badge";
import { ForumCategory } from '@/types';

interface CategoryHeaderProps {
  category: ForumCategory;
}

const CategoryHeader = ({ category }: CategoryHeaderProps) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
      <p className="text-muted-foreground mb-4">{category.description}</p>
      <Badge variant="outline" className="mb-6">
        {category.postsCount} {category.postsCount === 1 ? 'post' : 'posts'}
      </Badge>
    </div>
  );
};

export default CategoryHeader;
