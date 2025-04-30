
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const CategoryNotFound = () => {
  return (
    <div className="text-center py-12">
      <h1 className="text-2xl font-bold mb-2">Category Not Found</h1>
      <p className="text-muted-foreground mb-6">The requested category could not be found or may have been removed.</p>
      <Button asChild>
        <Link to="/forum">Return to Forum</Link>
      </Button>
    </div>
  );
};

export default CategoryNotFound;
