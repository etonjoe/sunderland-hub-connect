
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ForumCategory } from '@/types';

interface CategoryCardProps {
  category: ForumCategory;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
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
  );
};

export default CategoryCard;
