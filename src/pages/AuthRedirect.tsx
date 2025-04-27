
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from "sonner";

const AuthRedirect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    if (error) {
      // Log the error for debugging
      console.error('Auth error:', error, errorDescription);
      toast.error('Authentication error: ' + (errorDescription || error));
      
      // Redirect to confirmation page with error parameters
      navigate(`/auth/confirm?error=${error}&error_description=${encodeURIComponent(errorDescription || 'Unknown error')}`, { replace: true });
    } else {
      // Extract hash fragment and query params for proper redirection
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      
      // Check if this is a password reset flow
      const type = searchParams.get('type');
      if (type === 'recovery' || accessToken) {
        // For password reset, redirect to reset-password with all params
        const redirectURL = '/reset-password' + window.location.search + window.location.hash;
        console.log('Redirecting to:', redirectURL);
        navigate(redirectURL, { replace: true });
      } else {
        // If no error and not password reset, redirect to success page
        console.log('Auth successful, redirecting to confirmation page');
        toast.success('Authentication successful');
        navigate('/auth/confirm', { replace: true });
      }
    }
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-xl text-muted-foreground">
        Redirecting...
      </div>
    </div>
  );
};

export default AuthRedirect;
