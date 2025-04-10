
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Unauthorized = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-full bg-app-red/10 p-4">
            <Shield className="h-16 w-16 text-app-red" />
          </div>
          <h1 className="text-3xl font-bold">Access Denied</h1>
          <p className="text-gray-500">
            You don't have permission to access this page.
            {user && (
              <> Your current role is <span className="font-semibold">{user.role.replace('_', ' ')}</span>.</>
            )}
          </p>
        </div>
        
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
