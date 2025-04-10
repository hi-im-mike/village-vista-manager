
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { maintenanceRequests, properties } from '@/data/mockData';
import { ArrowUpDown, Check, Clock, Filter, Plus, Wrench, X, MessageSquare, ImagePlus } from 'lucide-react';

const Maintenance = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [filter, setFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'createdAt', direction: 'desc' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    propertyId: '',
    unitNumber: '',
    priority: 'medium'
  });

  // Filter requests based on user role and status filter
  const filteredRequests = maintenanceRequests.filter(request => {
    // Filter by status
    if (filter !== 'all' && request.status !== filter) {
      return false;
    }

    // Filter by user role
    if (user?.role === 'tenant') {
      return request.createdBy === user.id;
    } else if (user?.role === 'maintenance') {
      return request.assignedTo === user.id || !request.assignedTo;
    }

    // Property managers can see all requests
    return true;
  });

  // Sort requests
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    let valueA, valueB;
    
    switch (sortConfig.key) {
      case 'priority':
        const priorityOrder = { emergency: 0, high: 1, medium: 2, low: 3 };
        valueA = priorityOrder[a.priority as keyof typeof priorityOrder];
        valueB = priorityOrder[b.priority as keyof typeof priorityOrder];
        break;
      case 'createdAt':
        valueA = new Date(a.createdAt).getTime();
        valueB = new Date(b.createdAt).getTime();
        break;
      default:
        valueA = a[sortConfig.key as keyof typeof a] as string;
        valueB = b[sortConfig.key as keyof typeof b] as string;
    }
    
    if (valueA < valueB) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (valueA > valueB) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key: string) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleNewRequestChange = (field: string, value: string) => {
    setNewRequest(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitRequest = () => {
    // Validation
    if (!newRequest.title || !newRequest.description || !newRequest.propertyId || !newRequest.unitNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would be an API call
    toast({
      title: "Request Submitted",
      description: "Your maintenance request has been submitted successfully.",
    });
    setDialogOpen(false);
    
    // Reset form
    setNewRequest({
      title: '',
      description: '',
      propertyId: '',
      unitNumber: '',
      priority: 'medium'
    });
  };

  const priorityStyles = {
    emergency: { bg: 'bg-app-red/10', text: 'text-app-red' },
    high: { bg: 'bg-red-100', text: 'text-red-600' },
    medium: { bg: 'bg-app-amber/10', text: 'text-app-amber' },
    low: { bg: 'bg-app-green/10', text: 'text-app-green' },
  };

  const statusStyles = {
    pending: { bg: 'bg-app-amber/10', text: 'text-app-amber' },
    in_progress: { bg: 'bg-app-blue/10', text: 'text-app-blue' },
    completed: { bg: 'bg-app-green/10', text: 'text-app-green' },
    cancelled: { bg: 'bg-gray-100', text: 'text-gray-500' },
  };

  return (
    <AppLayout requiredRoles={['property_manager', 'tenant', 'maintenance']}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Maintenance Requests</h1>
            <p className="text-muted-foreground">
              {user?.role === 'tenant' 
                ? 'View and submit maintenance requests for your unit' 
                : 'Manage and track maintenance requests'}
            </p>
          </div>
          
          {/* Only tenants and property managers can create new requests */}
          {(user?.role === 'tenant' || user?.role === 'property_manager') && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Request
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create Maintenance Request</DialogTitle>
                  <DialogDescription>
                    Submit a new maintenance request for your property.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {user?.role === 'property_manager' && (
                    <div className="grid gap-2">
                      <Label htmlFor="property">Property</Label>
                      <Select 
                        value={newRequest.propertyId} 
                        onValueChange={(value) => handleNewRequestChange('propertyId', value)}
                      >
                        <SelectTrigger id="property">
                          <SelectValue placeholder="Select property" />
                        </SelectTrigger>
                        <SelectContent>
                          {properties.map((property) => (
                            <SelectItem key={property.id} value={property.id}>
                              {property.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <div className="grid gap-2">
                    <Label htmlFor="unit">Unit Number</Label>
                    <Input 
                      id="unit" 
                      value={newRequest.unitNumber}
                      onChange={(e) => handleNewRequestChange('unitNumber', e.target.value)}
                      placeholder="e.g., 101"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      value={newRequest.title}
                      onChange={(e) => handleNewRequestChange('title', e.target.value)}
                      placeholder="Brief description of the issue"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      value={newRequest.description}
                      onChange={(e) => handleNewRequestChange('description', e.target.value)}
                      placeholder="Please provide details about the issue..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select 
                      value={newRequest.priority} 
                      onValueChange={(value) => handleNewRequestChange('priority', value)}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="images">Images</Label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <ImagePlus className="w-8 h-8 mb-3 text-gray-400" />
                          <p className="text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG or JPEG (MAX. 4 MB each)
                          </p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" multiple />
                      </label>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSubmitRequest}>Submit Request</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <Tabs defaultValue="all" className="w-full max-w-md" onValueChange={setFilter}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleSort('priority')} className="hidden md:flex">
              <Filter className="mr-1 h-4 w-4" />
              Priority
              {sortConfig.key === 'priority' && (
                <ArrowUpDown className="ml-1 h-4 w-4" />
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleSort('createdAt')}>
              <Clock className="mr-1 h-4 w-4" />
              Date
              {sortConfig.key === 'createdAt' && (
                <ArrowUpDown className="ml-1 h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {sortedRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Wrench className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500 text-center">No maintenance requests found.</p>
                {(user?.role === 'tenant' || user?.role === 'property_manager') && (
                  <Button className="mt-4" onClick={() => setDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Request
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            sortedRequests.map((request) => {
              const property = properties.find(p => p.id === request.propertyId);
              const priorityStyle = priorityStyles[request.priority as keyof typeof priorityStyles];
              const statusStyle = statusStyles[request.status as keyof typeof statusStyles];

              return (
                <Card key={request.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{request.title}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <Badge variant="outline" className={`${statusStyle.bg} ${statusStyle.text} border-0 mr-2`}>
                            {request.status.replace('_', ' ')}
                          </Badge>
                          <span>
                            {property?.name} - Unit {request.unitNumber}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge className={`${priorityStyle.bg} ${priorityStyle.text} border-0`}>
                        {request.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-gray-700 mb-4">{request.description}</p>
                    
                    {request.images && request.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {request.images.map((image, idx) => (
                          <div key={idx} className="relative w-20 h-20 rounded-md overflow-hidden">
                            <img src={image} alt={`Issue ${idx + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}

                    {request.comments && request.comments.length > 0 && (
                      <div className="mt-4 border-t pt-3">
                        <h4 className="text-sm font-medium mb-2">Comments</h4>
                        <div className="space-y-2">
                          {request.comments.map((comment) => (
                            <div key={comment.id} className="text-sm bg-gray-50 rounded-md p-3">
                              <p>{comment.text}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-3">
                    <div className="text-sm text-gray-500">
                      Created {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                    
                    <div className="flex gap-2">
                      {/* Actions based on user role and request status */}
                      {user?.role === 'maintenance' && request.status !== 'completed' && (
                        request.status === 'pending' ? (
                          <Button size="sm" variant="outline" onClick={() => toast({ title: "Request accepted" })}>
                            Accept Request
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => toast({ title: "Request marked as complete" })}>
                            <Check className="mr-1 h-4 w-4" />
                            Mark Complete
                          </Button>
                        )
                      )}
                      
                      {user?.role === 'property_manager' && request.status === 'pending' && (
                        <Button size="sm" variant="outline" onClick={() => toast({ title: "Request assigned" })}>
                          Assign
                        </Button>
                      )}
                      
                      {(user?.role === 'tenant' || user?.role === 'property_manager') && request.status === 'pending' && (
                        <Button size="sm" variant="outline" className="text-red-500" onClick={() => toast({ title: "Request cancelled" })}>
                          <X className="mr-1 h-4 w-4" />
                          Cancel
                        </Button>
                      )}

                      <Button size="sm" variant="outline">
                        <MessageSquare className="mr-1 h-4 w-4" />
                        Comment
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Maintenance;
