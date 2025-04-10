
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  useEffect(() => {
    document.title = 'Village Vista - Property Management';
  }, []);

  // Make sure we're redirecting to the dashboard path
  return <Navigate to="/dashboard" replace />;
};

export default Index;
