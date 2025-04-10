
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Properties as Property, properties, tenants } from '@/data/mockData';
import { Search, Building2, Users, MapPin, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Properties = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedView, setSelectedView] = useState('grid');

  // Filter properties based on search term
  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get occupancy rate for a property
  const getOccupancyRate = (propertyId: string) => {
    const propertyTenants = tenants.filter(tenant => tenant.propertyId === propertyId);
    const property = properties.find(p => p.id === propertyId);
    
    return property ? Math.round((propertyTenants.length / property.units) * 100) : 0;
  };

  return (
    <AppLayout requiredRoles={['investor', 'property_manager', 'tenant', 'maintenance']}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
            <p className="text-muted-foreground">
              {user?.role === 'investor' && 'Manage your property portfolio'}
              {user?.role === 'property_manager' && 'Manage and oversee properties'}
              {user?.role === 'tenant' && 'View property information'}
              {user?.role === 'maintenance' && 'View properties and maintenance requests'}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search properties..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {user?.role === 'property_manager' && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Property
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Property</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new property
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {/* Property form fields would go here */}
                    <p className="text-center text-muted-foreground">
                      Property creation form would be implemented here
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Add Property</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all">All Properties</TabsTrigger>
              <TabsTrigger value="apartments">Apartments</TabsTrigger>
              <TabsTrigger value="condos">Condos</TabsTrigger>
              <TabsTrigger value="houses">Houses</TabsTrigger>
            </TabsList>

            <div className="flex bg-muted rounded-md">
              <Button 
                variant={selectedView === 'grid' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setSelectedView('grid')}
                className="rounded-r-none"
              >
                Grid
              </Button>
              <Button 
                variant={selectedView === 'list' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setSelectedView('list')}
                className="rounded-l-none"
              >
                List
              </Button>
            </div>
          </div>
          
          <TabsContent value="all">
            {filteredProperties.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Building2 className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-center">No properties found.</p>
                </CardContent>
              </Card>
            ) : (
              selectedView === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property) => (
                    <PropertyCard 
                      key={property.id} 
                      property={property}
                      occupancyRate={getOccupancyRate(property.id)}
                      userRole={user?.role || ''}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProperties.map((property) => (
                    <PropertyListItem
                      key={property.id}
                      property={property}
                      occupancyRate={getOccupancyRate(property.id)}
                      userRole={user?.role || ''}
                    />
                  ))}
                </div>
              )
            )}
          </TabsContent>
          
          <TabsContent value="apartments">
            <div className="text-center text-muted-foreground py-12">
              Content for apartments would be shown here
            </div>
          </TabsContent>
          
          <TabsContent value="condos">
            <div className="text-center text-muted-foreground py-12">
              Content for condos would be shown here
            </div>
          </TabsContent>
          
          <TabsContent value="houses">
            <div className="text-center text-muted-foreground py-12">
              Content for houses would be shown here
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

// Property Card Component
interface PropertyItemProps {
  property: Property;
  occupancyRate: number;
  userRole: string;
}

const PropertyCard = ({ property, occupancyRate, userRole }: PropertyItemProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={property.imageUrl}
          alt={property.name}
          className="h-full w-full object-cover"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle>{property.name}</CardTitle>
        <CardDescription className="flex items-center">
          <MapPin className="mr-1 h-4 w-4" />
          {property.address}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Units:</span>
            <p className="font-medium">{property.units}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Occupancy:</span>
            <p className="font-medium">{occupancyRate}%</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild className="w-full">
          <Link to={`/properties/${property.id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

// Property List Item Component
const PropertyListItem = ({ property, occupancyRate, userRole }: PropertyItemProps) => {
  return (
    <Card>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-48 h-32 md:h-auto overflow-hidden">
          <img
            src={property.imageUrl}
            alt={property.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col flex-grow p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold">{property.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center">
                <MapPin className="mr-1 h-3 w-3" />
                {property.address}
              </p>
            </div>
            <Badge variant="outline" className={
              occupancyRate >= 90 ? 'bg-green-100 text-green-600' :
              occupancyRate >= 70 ? 'bg-amber-100 text-amber-600' :
              'bg-red-100 text-red-600'
            }>
              {occupancyRate}% Occupied
            </Badge>
          </div>
          
          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center">
              <Building2 className="mr-1 h-4 w-4 text-app-blue" />
              <span>{property.units} units</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-1 h-4 w-4 text-app-blue" />
              <span>{Math.round((occupancyRate / 100) * property.units)} tenants</span>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button asChild variant="outline" size="sm" className="mr-2">
              <Link to={`/properties/${property.id}`}>View Details</Link>
            </Button>
            
            {userRole === 'property_manager' && (
              <Button asChild size="sm">
                <Link to={`/properties/${property.id}/edit`}>Manage Property</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Properties;
