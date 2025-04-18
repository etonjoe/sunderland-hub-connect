
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ConfirmationSuccess = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-fade-in shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            Welcome to the Family!
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Your email has been successfully confirmed
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4 px-6">
          <p className="text-muted-foreground">
            Thank you for verifying your email address. Your account is now fully activated and you can access all features of Sunderland Family Hub.
          </p>
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <h3 className="font-medium">Next Steps:</h3>
            <ul className="text-sm text-muted-foreground text-left list-disc list-inside space-y-1">
              <li>Sign in to your account</li>
              <li>Complete your profile information</li>
              <li>Explore our community resources</li>
              <li>Connect with other families</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 p-6">
          <Button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            Sign In Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ConfirmationSuccess;
