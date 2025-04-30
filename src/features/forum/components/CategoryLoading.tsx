
import { Skeleton } from "@/components/ui/skeleton";

const CategoryLoading = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-6 w-1/4" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
};

export default CategoryLoading;
