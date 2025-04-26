
import { Navigate, useSearchParams } from 'react-router-dom';

const Index = () => {
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');
  
  // If there's an error in the URL, redirect to the auth redirect handler
  if (error) {
    return <Navigate to={`/auth/callback${window.location.hash}`} replace />;
  }
  
  return <Navigate to="/" replace />;
};

export default Index;
