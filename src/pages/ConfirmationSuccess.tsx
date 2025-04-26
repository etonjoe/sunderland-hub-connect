
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";

const ConfirmationSuccess = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
    // Check if we have an error in the URL
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    if (error) {
      setHasError(true);
      setErrorMessage(errorDescription || 'An error occurred during email confirmation');
      toast.error('Email confirmation failed');
    }
    
    // If user is already authenticated, redirect to home
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-fade-in shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className={`rounded-full p-3 ${hasError ? 'bg-red-100' : 'bg-green-100'}`}>
              {hasError ? (
                <AlertTriangle className="h-12 w-12 text-red-500" />
              ) : (
                <CheckCircle className="h-12 w-12 text-green-500" />
              )}
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            {hasError ? 'Confirmation Failed' : 'Welcome to the Family!'}
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            {hasError ? 'There was a problem with your email confirmation' : 'Your email has been successfully confirmed'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4 px-6">
          {hasError ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                {errorMessage || 'The confirmation link may have expired or is invalid. Please try again or contact support.'}
              </p>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <h3 className="font-medium">What to do next:</h3>
                <ul className="text-sm text-muted-foreground text-left list-disc list-inside space-y-1">
                  <li>Try signing in with your email and password</li>
                  <li>Use the password reset option if needed</li>
                  <li>Contact support if the issue persists</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
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
            </div>
          )}
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
