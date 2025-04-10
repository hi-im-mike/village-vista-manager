
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AppHeader } from '@/components/layout/AppHeader';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AppLayoutProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children,
  requiredRoles = [] 
}) => {
  const { user, isAuthenticated, isLoading, setUser } = useAuth();
  const { toast } = useToast();
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  
  useEffect(() => {
    // Set up listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          setRedirectToLogin(true);
        } else if (event === 'SIGNED_IN' && session?.user) {
          // Handle signed in event
        } else if (event === 'TOKEN_REFRESHED') {
          // Handle token refreshed
        } else if (!session) {
          setRedirectToLogin(true);
        }
      }
    );

    // Check current session on mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setRedirectToLogin(true);
      }
    };

    checkSession();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // If still loading, show a loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-app-blue"></div>
      </div>
    );
  }

  // If redirect flag is set or not authenticated, redirect to login
  if (redirectToLogin || !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check if user has required role
  if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 w-full overflow-hidden bg-gray-50">
          <AppHeader />
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
