
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
      "Auth status:",
      isAuthenticated
    );
  }, [location.pathname, isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md p-6">
        <h1 className="text-8xl font-bold mb-6 text-blue-500">404</h1>
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Page Not Found</h2>
        
        <p className="text-lg mb-3 text-gray-600">
          The page <span className="font-mono bg-gray-100 px-2 py-1 rounded">{location.pathname}</span> could not be found.
        </p>
        
        {!isAuthenticated && location.pathname !== "/login" && (
          <p className="text-lg mb-6 text-gray-600">
            You might need to <Link to="/login" className="text-blue-500 hover:underline">log in</Link> to access this page.
          </p>
        )}
        
        <p className="text-lg mb-8 text-gray-600">
          Please check the URL or navigate back to the home page.
        </p>
        
        <Button asChild size="lg" className="bg-blue-500 hover:bg-blue-600">
          <Link to="/" className="inline-flex items-center px-8 py-3">
            <Home className="mr-2 h-5 w-5" />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
