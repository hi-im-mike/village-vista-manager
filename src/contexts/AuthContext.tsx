
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, AuthContextType, UserRole } from '@/types/auth';
import { useToast } from "@/components/ui/use-toast";

// Mock user data - in a real app, this would come from your API
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'investor@example.com',
    name: 'John Investor',
    role: 'investor' as UserRole,
    avatar: 'https://i.pravatar.cc/150?u=investor',
  },
  {
    id: '2',
    email: 'manager@example.com',
    name: 'Sarah Manager',
    role: 'property_manager' as UserRole,
    avatar: 'https://i.pravatar.cc/150?u=manager',
  },
  {
    id: '3',
    email: 'tenant@example.com',
    name: 'Mike Tenant',
    role: 'tenant' as UserRole,
    avatar: 'https://i.pravatar.cc/150?u=tenant',
  },
  {
    id: '4',
    email: 'maintenance@example.com',
    name: 'Bob Maintenance',
    role: 'maintenance' as UserRole,
    avatar: 'https://i.pravatar.cc/150?u=maintenance',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user with matching email (in a real app, this would be a server call)
      const foundUser = MOCK_USERS.find(u => u.email === email);
      
      if (foundUser && password === 'password') { // Super secure password check!
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        toast({
          title: "Login successful",
          description: `Welcome back, ${foundUser.name}!`,
        });
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
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
