
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
  ArrowLeft, Home, User, Calendar, DollarSign, 
  Loader2, FilePlus, UserPlus, Trash2, Calculator 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  getPropertyUnitById, getPropertyById, getTenants,
  PropertyUnit, Property, Tenant 
} from '@/services/supabaseService';
import { AddTenantModal } from '@/components/tenants/AddTenantModal';
import { RentCalculatorModal } from '@/components/tenants/RentCalculatorModal';

const UnitDetails = () => {
  const { propertyId, unitId } = useParams<{ propertyId: string; unitId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [unit, setUnit] = useState<PropertyUnit | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
  const [isRentCalculatorOpen, setIsRentCalculatorOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const fetchUnitDetails = async () => {
    if (!propertyId || !unitId) return;
    
    setIsLoading(true);
    
    try {
      const [unitData, propertyData, tenantsData] = await Promise.all([
        getPropertyUnitById(unitId),
        getPropertyById(propertyId),
        getTenants(unitId)
      ]);
      
      if (!unitData || !propertyData) {
        toast({
          title: "Resource not found",
          description: "The requested unit or property could not be found.",
          variant: "destructive"
        });
        navigate(`/properties/${propertyId}`);
        return;
      }
      
      setUnit(unitData);
      setProperty(propertyData);
      // Sort tenants by isPrimary first, then by user_id
      setTenants(
        tenantsData.sort((a, b) => {
          // Sort primary tenants first
          if (a.is_primary && !b.is_primary) return -1;
          if (!a.is_primary && b.is_primary) return 1;
          
          // Then sort by user_id
          return a.user_id.localeCompare(b.user_id);
        })
      );
    } catch (error) {
      console.error('Error fetching unit details:', error);
      toast({
        title: "Error loading data",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnitDetails();
  }, [unitId, propertyId]);

  const handleAddTenant = () => {
    fetchUnitDetails();
    setIsAddTenantModalOpen(false);
  };

  const handleUpdateRent = (tenantId: string, newRent: number) => {
    // This will be implemented in the RentCalculatorModal component
    setIsRentCalculatorOpen(false);
    fetchUnitDetails();
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const openRentCalculator = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsRentCalculatorOpen(true);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'occupied':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-amber-100 text-amber-800';
      case 'vacant':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AppLayout requiredRoles={['investor', 'property_manager', 'tenant', 'maintenance']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(`/properties/${propertyId}`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isLoading ? 'Loading...' : `Unit ${unit?.unit_number}`}
            </h1>
            {!isLoading && property && (
              <p className="text-gray-500">{property.name}</p>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Unit Overview Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Unit Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Unit Number</p>
                      <p className="text-xl font-semibold">{unit?.unit_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className={`inline-flex px-2 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(unit?.status || 'vacant')}`}>
                        {unit?.status === 'occupied' ? 'Occupied' : 
                         unit?.status === 'maintenance' ? 'Under Maintenance' : 'Vacant'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tenants</p>
                      <p className="text-xl font-semibold">{tenants.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Actions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => setIsAddTenantModalOpen(true)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add New Tenant
                  </Button>
                  
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    disabled={!selectedTenant}
                  >
                    <FilePlus className="h-4 w-4 mr-2" />
                    Upload Lease Agreement
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Tenants List */}
            <Card>
              <CardHeader>
                <CardTitle>Tenants</CardTitle>
                <CardDescription>
                  {unit?.status === 'occupied' 
                    ? 'Manage tenants currently occupying this unit' 
                    : 'No tenants currently occupying this unit'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tenants.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <User className="h-8 w-8 mx-auto text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-700 mt-2">No tenants found</h3>
                    <p className="text-gray-500 mt-1">Add a tenant to this unit</p>
                    <Button 
                      onClick={() => setIsAddTenantModalOpen(true)} 
                      className="mt-4"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Tenant
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableCaption>List of all tenants in Unit {unit?.unit_number}</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tenant</TableHead>
                        <TableHead>Primary</TableHead>
                        <TableHead>Lease Dates</TableHead>
                        <TableHead>Move In</TableHead>
                        {/* Only show rent column conditionally */}
                        <TableHead>Monthly Rent</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tenants.map((tenant) => (
                        <TableRow key={tenant.id}>
                          <TableCell className="font-medium">{tenant.user_id}</TableCell>
                          <TableCell>{tenant.is_primary ? 'Yes' : 'No'}</TableCell>
                          <TableCell>
                            {formatDate(tenant.lease_start)} - {formatDate(tenant.lease_end)}
                          </TableCell>
                          <TableCell>{formatDate(tenant.move_in_date)}</TableCell>
                          <TableCell>
                            {tenant.is_primary && tenant.monthly_rent 
                              ? `$${tenant.monthly_rent.toFixed(2)}`
                              : tenant.is_primary 
                                ? 'Not set'
                                : '-'}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openRentCalculator(tenant)}
                              disabled={!tenant.is_primary}
                            >
                              <Calculator className="h-4 w-4 mr-1" />
                              Rent
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Lease Documents Card - to be implemented */}
            <Card>
              <CardHeader>
                <CardTitle>Lease Agreements</CardTitle>
                <CardDescription>
                  View and manage lease documents for this unit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <FilePlus className="h-8 w-8 mx-auto text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-700 mt-2">No lease documents found</h3>
                  <p className="text-gray-500 mt-1">Upload a lease agreement for this unit</p>
                  <Button 
                    className="mt-4"
                    variant="outline"
                  >
                    <FilePlus className="h-4 w-4 mr-2" />
                    Upload Lease Agreement
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      {/* Modals */}
      {unit && (
        <>
          <AddTenantModal
            open={isAddTenantModalOpen}
            onOpenChange={setIsAddTenantModalOpen}
            onTenantAdded={handleAddTenant}
            unit={unit}
          />
          
          {selectedTenant && (
            <RentCalculatorModal
              open={isRentCalculatorOpen}
              onOpenChange={setIsRentCalculatorOpen}
              tenant={selectedTenant}
              onRentUpdated={handleUpdateRent}
            />
          )}
        </>
      )}
    </AppLayout>
  );
};

export default UnitDetails;
