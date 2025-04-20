
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background">
      <div className="text-center max-w-md p-6">
        <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
        <p className="text-2xl font-semibold mb-2">Page Not Found</p>
        <p className="text-muted-foreground mb-2">
          The page <span className="font-mono bg-muted px-2 py-1 rounded">{location.pathname}</span> could not be found.
        </p>
        <p className="text-muted-foreground mb-6">
          Please check the URL or navigate back to the home page.
        </p>
        <Button asChild>
          <Link to="/" className="inline-flex items-center">
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
