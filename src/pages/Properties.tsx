
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { properties } from '@/data/mockData';
import { AddPropertyModal } from '@/components/properties/AddPropertyModal';

const Properties = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
      </div>
      
      <AddPropertyModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen} 
      />
    </AppLayout>
  );
};

export default Properties;
