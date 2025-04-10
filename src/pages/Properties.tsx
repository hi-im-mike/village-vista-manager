
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { AddPropertyModal } from '@/components/properties/AddPropertyModal';
import { getProperties, Property } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';

const Properties = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const data = await getProperties();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: "Error loading properties",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handlePropertyAdded = () => {
    fetchProperties();
  };

  return (
    <AppLayout requiredRoles={['investor', 'property_manager', 'tenant', 'maintenance']}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Properties</h1>
            <p className="text-gray-500">Manage and view all properties in the system.</p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 self-start">
            <Plus className="h-4 w-4" />
            Add New Property
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium text-gray-700">No properties yet</h3>
            <p className="text-gray-500 mt-2">Add your first property to get started.</p>
            <Button onClick={() => setIsAddModalOpen(true)} className="mt-4">
              Add Property
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card key={property.id}>
                <CardHeader className="pb-2">
                  <CardTitle>{property.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">{property.address}</p>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm">
                      <span>Units:</span>
                      <span className="font-medium">{property.units}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Occupancy:</span>
                      <span className="font-medium">90%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <AddPropertyModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen} 
        onPropertyAdded={handlePropertyAdded}
      />
    </AppLayout>
  );
};

export default Properties;
