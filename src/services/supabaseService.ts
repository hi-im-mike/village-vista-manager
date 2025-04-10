
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';

// Property types
export interface Property {
  id: string;
  name: string;
  address: string;
  units: number;
  image_url?: string;
  created_at: string;
  created_by?: string;
}

export interface NewProperty {
  name: string;
  address: string;
  units: number;
  image_url?: string;
  created_by?: string;
}

// Profile types
export interface Profile {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewProfile {
  email: string;
  name: string;
  role: string;
  password: string;
}

// Property functions
export const getProperties = async (): Promise<Property[]> => {
  const { data, error } = await supabase
    .from('properties')
    .select('*');
  
  if (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
  
  return data || [];
};

export const getPropertyById = async (id: string): Promise<Property | null> => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching property with id ${id}:`, error);
    return null;
  }
  
  return data;
};

export const createProperty = async (property: NewProperty): Promise<Property> => {
  const { data, error } = await supabase
    .from('properties')
    .insert(property)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating property:', error);
    throw error;
  }
  
  return data;
};

export const updateProperty = async (id: string, updates: Partial<Property>): Promise<Property> => {
  const { data, error } = await supabase
    .from('properties')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating property with id ${id}:`, error);
    throw error;
  }
  
  return data;
};

export const deleteProperty = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting property with id ${id}:`, error);
    throw error;
  }
};

// Profile functions
export const getProfiles = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*');
  
  if (error) {
    console.error('Error fetching profiles:', error);
    throw error;
  }
  
  return data || [];
};

export const getProfileById = async (id: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching profile with id ${id}:`, error);
    return null;
  }
  
  return data;
};

export const updateProfile = async (id: string, updates: Partial<Profile>): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating profile with id ${id}:`, error);
    throw error;
  }
  
  return data;
};

// Authentication helper to create a new user and associated profile
export const createUser = async ({ email, name, role, password }: NewProfile): Promise<void> => {
  // First, create the auth user
  const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role
      }
    }
  });
  
  if (signUpError) {
    console.error('Error creating user:', signUpError);
    throw signUpError;
  }
  
  // Note: The profile is created automatically via the database trigger
};

// Current user profile
export const getCurrentProfile = async (): Promise<Profile | null> => {
  const { data: sessionData } = await supabase.auth.getSession();
  
  if (!sessionData.session?.user) {
    return null;
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', sessionData.session.user.id)
    .single();
  
  if (error) {
    console.error('Error fetching current user profile:', error);
    return null;
  }
  
  return data;
};
