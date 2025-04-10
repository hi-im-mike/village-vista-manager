
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card';
import { 
  Table, TableHeader, TableBody, TableRow, 
  TableHead, TableCell, TableCaption 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Plus, ArrowLeft, Loader2, Home, User, Calendar, 
  DollarSign, CheckCircle, AlertCircle, Clock 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  getPropertyById, getPropertyUnits, Property, 
  PropertyUnit, getTenants, Tenant 
} from '@/services/supabaseService';
import { AddUnitModal } from '@/components/properties/AddUnitModal';

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [units, setUnits] = useState<PropertyUnit[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchProperty = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const propertyData = await getPropertyById(id);
      if (!propertyData) {
        toast({
          title: "Property not found",
          description: "The requested property could not be found.",
          variant: "destructive"
        });
        navigate('/properties');
        return;
      }
      
      setProperty(propertyData);
      
      // Fetch units for this property
      const unitsData = await getPropertyUnits(id);
      setUnits(unitsData);
      
      // Fetch tenants for all units
      const unitIds = unitsData.map(unit => unit.id);
      if (unitIds.length > 0) {
        const tenantsPromises = unitIds.map(unitId => getTenants(unitId));
        const tenantsArrays = await Promise.all(tenantsPromises);
        const allTenants = tenantsArrays.flat();
        setTenants(allTenants);
      }
    } catch (error) {
      console.error('Error fetching property details:', error);
      toast({
        title: "Error loading property",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const handleAddUnit = () => {
    fetchProperty();
  };

  const getUnitStatusIcon = (status: string) => {
    switch (status) {
      case 'occupied':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'maintenance':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'vacant':
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getUnitStatusText = (status: string) => {
    switch (status) {
      case 'occupied':
        return 'Occupied';
      case 'maintenance':
        return 'Under Maintenance';
      case 'vacant':
      default:
        return 'Vacant';
    }
  };

  const getTenantCountForUnit = (unitId: string) => {
    return tenants.filter(tenant => tenant.unit_id === unitId).length;
  };

  return (
    <AppLayout requiredRoles={['investor', 'property_manager', 'tenant', 'maintenance']}>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/properties')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isLoading ? 'Loading...' : property?.name}
            </h1>
            {!isLoading && property && (
              <p className="text-gray-500">{property.address}</p>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <Card className="w-full md:w-auto">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Property Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Units</p>
                      <p className="text-xl font-semibold">{property?.units || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Units Added</p>
                      <p className="text-xl font-semibold">{units.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Occupancy</p>
                      <p className="text-xl font-semibold">
                        {units.filter(unit => unit.status === 'occupied').length}/{units.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tenants</p>
                      <p className="text-xl font-semibold">{tenants.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Button 
                onClick={() => setIsAddUnitModalOpen(true)} 
                className="flex items-center gap-2 md:self-start"
              >
                <Plus className="h-4 w-4" />
                Add New Unit
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Property Units</CardTitle>
                <CardDescription>
                  Manage all units for this property
                </CardDescription>
              </CardHeader>
              <CardContent>
                {units.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <Home className="h-8 w-8 mx-auto text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-700 mt-2">No units added yet</h3>
                    <p className="text-gray-500 mt-1">Add your first unit to this property</p>
                    <Button 
                      onClick={() => setIsAddUnitModalOpen(true)} 
                      className="mt-4"
                    >
                      Add Unit
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableCaption>List of all units in {property?.name}</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Unit #</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tenants</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {units.map((unit) => (
                        <TableRow key={unit.id}>
                          <TableCell className="font-medium">{unit.unit_number}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getUnitStatusIcon(unit.status)}
                              <span>{getUnitStatusText(unit.status)}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getTenantCountForUnit(unit.id)}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/properties/${id}/units/${unit.id}`)}
                            >
                              Manage
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      {property && (
        <AddUnitModal
          open={isAddUnitModalOpen}
          onOpenChange={setIsAddUnitModalOpen}
          onUnitAdded={handleAddUnit}
          property={property}
        />
      )}
    </AppLayout>
  );
};

export default PropertyDetails;
