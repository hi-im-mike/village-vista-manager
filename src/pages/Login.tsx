
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingDemo, setIsCreatingDemo] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      loginSchema.parse(formData);
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      await login(formData.email, formData.password);
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      // Error is already handled in the login function
    } finally {
      setIsSubmitting(false);
    }
  };

  const createAndLoginDemoUser = async (email: string, role: string, displayName: string) => {
    setIsCreatingDemo(true);
    setFormData({ email, password: 'password' });
    
    try {
      // Check if user already exists first
      const { data: { user } } = await supabase.auth.signInWithPassword({
        email,
        password: 'password',
      });
      
      if (user) {
        // User exists, just login
        toast({
          title: "Login successful",
          description: `Welcome back, ${displayName}!`,
        });
        return;
      }
    } catch (error) {
      // User doesn't exist, proceed with creation
      try {
        // Create the user
        const { data, error } = await supabase.auth.signUp({
          email,
          password: 'password',
          options: {
            data: {
              name: displayName,
              role: role,
            }
          }
        });

        if (error) throw error;

        // Auto-login after creation
        await supabase.auth.signInWithPassword({
          email,
          password: 'password',
        });

        toast({
          title: "Demo account created",
          description: `Logged in as ${displayName}`,
        });

      } catch (signupError) {
        console.error('Error creating demo user:', signupError);
        toast({
          title: "Error creating demo account",
          description: (signupError as Error).message,
          variant: "destructive",
        });
      }
    } finally {
      setIsCreatingDemo(false);
    }
  };

  const demoAccounts = [
    { email: 'investor@example.com', role: 'investor', displayName: 'Investor' },
    { email: 'manager@example.com', role: 'property_manager', displayName: 'Property Manager' },
    { email: 'tenant@example.com', role: 'tenant', displayName: 'Tenant' },
    { email: 'maintenance@example.com', role: 'maintenance', displayName: 'Maintenance Staff' },
  ];

  const loginAsDemoUser = (email: string, role: string, displayName: string) => {
    createAndLoginDemoUser(email, role, displayName);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Building2 className="h-12 w-12 text-app-blue" />
          <h1 className="text-3xl font-bold">Village Vista</h1>
          <p className="text-gray-500">Property Management System</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email and password to access your dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <Alert variant="default" className="bg-gray-50 border-gray-200">
                <AlertTitle>Demo Information</AlertTitle>
                <AlertDescription>
                  Click on a demo account button below to automatically create and log in with that role.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isSubmitting || isCreatingDemo}>
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
              
              <div className="w-full">
                <p className="text-sm text-center text-gray-500 mb-3">Demo accounts</p>
                <div className="grid grid-cols-2 gap-2">
                  {demoAccounts.map((account) => (
                    <Button
                      key={account.email}
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => loginAsDemoUser(account.email, account.role, account.displayName)}
                      disabled={isCreatingDemo}
                      className="text-xs"
                    >
                      {account.displayName}
                    </Button>
                  ))}
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
