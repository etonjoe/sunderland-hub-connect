
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const { resetPassword, isLoading, supabaseConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email) {
      setError("Email is required");
      return;
    }
    
    try {
      const result = await resetPassword(email);
      if (result) {
        setSuccess(true);
      }
    } catch (err) {
      console.error("Password reset error:", err);
      setError("An unexpected error occurred. Please try again later.");
    }
  };
  
  return (
    <div className="container max-w-md mx-auto py-10">
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!supabaseConfigured && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Configuration Error</AlertTitle>
              <AlertDescription>
                Supabase is not configured correctly. Password reset features won't work until this is fixed.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success ? (
            <div className="text-center space-y-4">
              <div className="bg-green-50 text-green-800 p-4 rounded-md">
                <p className="font-medium">Check your email</p>
                <p className="text-sm mt-1">We've sent a password reset link to {email}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Make sure to check your spam folder if you don't see the email in your inbox.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || !supabaseConfigured}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-family-blue hover:bg-blue-600"
                disabled={isLoading || !supabaseConfigured}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/login" className="text-sm text-family-blue hover:underline inline-flex items-center">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
