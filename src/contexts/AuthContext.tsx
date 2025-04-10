
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, AuthContextType, UserRole } from '@/types/auth';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { getCurrentProfile } from '@/services/supabaseService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || event === 'USER_DELETED' || !session) {
          setUser(null);
          localStorage.removeItem('user');
        } else if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session) {
          // Fetch user profile when signed in
          const fetchProfile = async () => {
            try {
              const profile = await getCurrentProfile();
              if (profile) {
                setUser({
                  id: profile.id,
                  email: profile.email || '',
                  name: profile.name || '',
                  role: profile.role as UserRole || 'tenant',
                });
                localStorage.setItem('user', JSON.stringify(profile));
              }
            } catch (error) {
              console.error('Error fetching user profile:', error);
              toast({
                title: "Error loading profile",
                description: "Please try logging in again",
                variant: "destructive",
              });
            }
          };
          
          // Use setTimeout to avoid potential deadlocks with Supabase auth listener
          setTimeout(() => {
            fetchProfile();
          }, 0);
        }
      }
    );

    // Check if user is already logged in
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const profile = await getCurrentProfile();
          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email || '',
              name: profile.name || '',
              role: profile.role as UserRole || 'tenant',
            });
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        toast({
          title: "Authentication Error",
          description: "Please try logging in again",
          variant: "destructive",
        });
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const profile = await getCurrentProfile();
        if (profile) {
          setUser({
            id: profile.id,
            email: profile.email || '',
            name: profile.name || '',
            role: profile.role as UserRole || 'tenant',
          });
          toast({
            title: "Login successful",
            description: `Welcome back, ${profile.name}!`,
          });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: (error as Error).message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem('user');
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
