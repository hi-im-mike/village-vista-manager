
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';

// Property types
export interface Property {
  id: string;
  name: string;
  address: string;
  units: number;
  total_units: number | null;
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

// Property Unit types
export interface PropertyUnit {
  id: string;
  property_id: string;
  unit_number: string;
  status: 'vacant' | 'occupied' | 'maintenance';
  created_at: string;
  updated_at: string;
}

export interface NewPropertyUnit {
  property_id: string;
  unit_number: string;
  status?: 'vacant' | 'occupied' | 'maintenance';
}

// Tenant types
export interface Tenant {
  id: string;
  unit_id: string;
  user_id: string;
  is_primary?: boolean;
  lease_start?: string;
  lease_end?: string;
  move_in_date?: string;
  monthly_rent?: number;
  created_at: string;
  updated_at: string;
}

export interface NewTenant {
  unit_id: string;
  user_id: string;
  is_primary?: boolean;
  lease_start?: string;
  lease_end?: string;
  move_in_date?: string;
  monthly_rent?: number;
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
  
  return data as Property[] || [];
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
  
  return data as Property;
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
  
  return data as Property;
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
  
  return data as Property;
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

// Property Unit functions
export const getPropertyUnits = async (propertyId?: string): Promise<PropertyUnit[]> => {
  let query = supabase.from('property_units').select('*');
  
  if (propertyId) {
    query = query.eq('property_id', propertyId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching property units:', error);
    throw error;
  }
  
  return data as PropertyUnit[] || [];
};

export const getPropertyUnitById = async (id: string): Promise<PropertyUnit | null> => {
  const { data, error } = await supabase
    .from('property_units')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching property unit with id ${id}:`, error);
    return null;
  }
  
  return data as PropertyUnit;
};

export const createPropertyUnit = async (unit: NewPropertyUnit): Promise<PropertyUnit> => {
  const { data, error } = await supabase
    .from('property_units')
    .insert(unit)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating property unit:', error);
    throw error;
  }
  
  return data as PropertyUnit;
};

export const updatePropertyUnit = async (id: string, updates: Partial<PropertyUnit>): Promise<PropertyUnit> => {
  const { data, error } = await supabase
    .from('property_units')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating property unit with id ${id}:`, error);
    throw error;
  }
  
  return data as PropertyUnit;
};

export const deletePropertyUnit = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('property_units')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting property unit with id ${id}:`, error);
    throw error;
  }
};

// Tenant functions
export const getTenants = async (unitId?: string): Promise<Tenant[]> => {
  let query = supabase.from('tenants').select('*');
  
  if (unitId) {
    query = query.eq('unit_id', unitId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching tenants:', error);
    throw error;
  }
  
  return data as Tenant[] || [];
};

export const getTenantById = async (id: string): Promise<Tenant | null> => {
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching tenant with id ${id}:`, error);
    return null;
  }
  
  return data as Tenant;
};

export const createTenant = async (tenant: NewTenant): Promise<Tenant> => {
  const { data, error } = await supabase
    .from('tenants')
    .insert(tenant)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating tenant:', error);
    throw error;
  }
  
  return data as Tenant;
};

export const updateTenant = async (id: string, updates: Partial<Tenant>): Promise<Tenant> => {
  const { data, error } = await supabase
    .from('tenants')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating tenant with id ${id}:`, error);
    throw error;
  }
  
  return data as Tenant;
};

export const deleteTenant = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('tenants')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting tenant with id ${id}:`, error);
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
