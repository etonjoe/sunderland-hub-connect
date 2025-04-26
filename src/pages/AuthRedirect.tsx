
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
      // Redirect to confirmation page with error parameters
      navigate(`/auth/confirm?error=${error}&error_description=${encodeURIComponent(errorDescription || 'Unknown error')}`, { replace: true });
    } else {
      // If no error, redirect to success page
      navigate('/auth/confirm', { replace: true });
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
