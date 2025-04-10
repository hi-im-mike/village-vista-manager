
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AppHeader } from '@/components/layout/AppHeader';
import { Navigate } from 'react-router-dom';

interface AppLayoutProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children,
  requiredRoles = [] 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // If still loading, show a loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-app-blue"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
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
