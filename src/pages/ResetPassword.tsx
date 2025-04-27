
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Check if we have a hash fragment with access_token
  useEffect(() => {
    const fragment = window.location.hash;
    if (!fragment.includes('access_token')) {
      setError('Invalid or expired password reset link. Please request a new password reset.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!newPassword) {
      setError("New password is required");
      return;
    }
    
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (updateError) {
        throw updateError;
      }
      
      setSuccess(true);
      toast.success('Password has been reset successfully');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container max-w-md mx-auto py-10">
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Set New Password</CardTitle>
          <CardDescription className="text-center">
            Create a new password for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                <p className="font-medium flex items-center justify-center">
                  <Check className="mr-2 h-5 w-5" />
                  Password reset successful
                </p>
                <p className="text-sm mt-1">Your password has been updated.</p>
              </div>
              <p className="text-sm text-muted-foreground">
                You will be redirected to the login page in a few seconds...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-family-blue hover:bg-blue-600"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Reset Password'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
