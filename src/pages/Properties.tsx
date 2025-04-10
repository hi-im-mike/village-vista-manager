
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { properties } from '@/data/mockData';

const Properties = () => {
  return (
    <AppLayout requiredRoles={['investor', 'property_manager', 'tenant', 'maintenance']}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Properties</h1>
          <p className="text-gray-500">Manage and view all properties in the system.</p>
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
                    <span className="font-medium">{property.occupancyRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Properties;
