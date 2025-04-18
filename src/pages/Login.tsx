
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, supabaseConfigured } = useAuth();
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }
    
    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate('/');
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred during login.");
    }
  };

  const fillDemoCredentials = (type: 'admin' | 'user' | 'premium') => {
    if (type === 'admin') {
      setFormData({
        email: 'admin@example.com',
        password: 'admin123'
      });
    } else if (type === 'user') {
      setFormData({
        email: 'user@example.com',
        password: 'user123'
      });
    } else if (type === 'premium') {
      setFormData({
        email: 'premium@example.com',
        password: 'premium123'
      });
    }
  };
  
  return (
    <div className="container max-w-md mx-auto py-10">
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Sign in to access the SunderlandFamily Hub
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!supabaseConfigured && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Configuration Error</AlertTitle>
              <AlertDescription>
                Supabase is not configured correctly. Authentication features won't work until this is fixed. Please check your Supabase connection in the project settings.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Login Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={!supabaseConfigured}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-family-blue hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={!supabaseConfigured}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-family-blue hover:bg-blue-600"
              disabled={isLoading || !supabaseConfigured}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          {supabaseConfigured && (
            <div className="mt-6">
              <p className="text-center text-sm text-muted-foreground mb-2">
                <span className="mr-1">Demo Accounts:</span>
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => fillDemoCredentials('admin')}
                >
                  Admin
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => fillDemoCredentials('user')}
                >
                  Regular User
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => fillDemoCredentials('premium')}
                >
                  Premium User
                </Button>
              </div>
              <div className="mt-2 text-xs text-center text-muted-foreground">
                <p>Click buttons above to fill credentials automatically.</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-muted-foreground w-full">
            Don't have an account?{" "}
            <Link to="/register" className={`${supabaseConfigured ? 'text-family-blue hover:underline' : 'text-muted-foreground cursor-not-allowed'}`}>
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
