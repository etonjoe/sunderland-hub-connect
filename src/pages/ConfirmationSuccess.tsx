
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from 'lucide-react';
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
    <div className="container max-w-md mx-auto py-10">
      <Card className="animate-fade-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Email Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Your email has been successfully confirmed. You can now sign in to your account.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button
            onClick={() => navigate('/login')}
            className="bg-family-blue hover:bg-blue-600"
          >
            Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ConfirmationSuccess;
