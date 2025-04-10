
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Users,
  Wrench,
} from 'lucide-react';
import { properties, maintenanceRequests, financialRecords, tenants, showings } from '@/data/mockData';

// Static overview stats for different roles
const roleStats = {
  investor: [
    { title: 'Total Properties', value: '3', icon: Building2, change: '+1', changeType: 'increase' },
    { title: 'Occupancy Rate', value: '94%', icon: Users, change: '+2%', changeType: 'increase' },
    { title: 'Monthly Income', value: '$36,500', icon: DollarSign, change: '+5%', changeType: 'increase' },
    { title: 'Monthly Expenses', value: '$7,500', icon: ArrowDown, change: '-3%', changeType: 'decrease' },
  ],
  property_manager: [
    { title: 'Active Tenants', value: '45', icon: Users, change: '+2', changeType: 'increase' },
    { title: 'Maintenance Requests', value: '8', icon: Wrench, change: '-3', changeType: 'decrease' },
    { title: 'Upcoming Showings', value: '5', icon: Calendar, change: '+1', changeType: 'increase' },
    { title: 'Upcoming Renewals', value: '3', icon: Clock, change: '', changeType: 'neutral' },
  ],
  tenant: [
    { title: 'Lease Days Remaining', value: '267', icon: Calendar, change: '', changeType: 'neutral' },
    { title: 'Open Maintenance Requests', value: '1', icon: Wrench, change: '', changeType: 'neutral' },
    { title: 'Last Rent Payment', value: 'Apr 1', icon: DollarSign, change: '', changeType: 'neutral' },
    { title: 'Building Announcements', value: '2', icon: Users, change: '+1', changeType: 'increase' },
  ],
  maintenance: [
    { title: 'Assigned Tasks', value: '4', icon: Wrench, change: '+1', changeType: 'increase' },
    { title: 'High Priority', value: '1', icon: ArrowUp, change: '', changeType: 'neutral' },
    { title: 'Completed Today', value: '3', icon: Clock, change: '', changeType: 'neutral' },
    { title: 'Materials Orders', value: '2', icon: Building2, change: '', changeType: 'neutral' },
  ],
};

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    return null;
  }

  const userStats = roleStats[user.role as keyof typeof roleStats] || [];

  // Recent activities based on user role
  const getRecentActivities = () => {
    switch (user.role) {
      case 'investor':
        return financialRecords.slice(0, 5).map(record => ({
          id: record.id,
          title: `${record.type === 'income' ? 'Income' : 'Expense'}: ${record.description}`,
          date: record.date,
          amount: `$${record.amount.toLocaleString()}`,
          type: record.type,
        }));
      case 'property_manager':
        return [
          ...maintenanceRequests.slice(0, 2).map(req => ({
            id: req.id,
            title: `Maintenance Request: ${req.title}`,
            date: new Date(req.createdAt).toLocaleDateString(),
            status: req.status,
            type: 'maintenance',
          })),
          ...showings.slice(0, 2).map(show => ({
            id: show.id,
            title: `Showing: ${properties.find(p => p.id === show.propertyId)?.name} Unit ${show.unitNumber}`,
            date: show.date,
            prospect: show.prospectName,
            type: 'showing',
          })),
        ];
      case 'tenant':
        return maintenanceRequests
          .filter(req => req.createdBy === user.id)
          .map(req => ({
            id: req.id,
            title: `Maintenance: ${req.title}`,
            date: new Date(req.createdAt).toLocaleDateString(),
            status: req.status,
            type: 'maintenance',
          }));
      case 'maintenance':
        return maintenanceRequests
          .filter(req => req.assignedTo === user.id || !req.assignedTo)
          .map(req => ({
            id: req.id,
            title: req.title,
            property: properties.find(p => p.id === req.propertyId)?.name,
            unit: req.unitNumber,
            priority: req.priority,
            type: 'maintenance',
          }));
      default:
        return [];
    }
  };

  // Properties display
  const userProperties = (() => {
    switch (user.role) {
      case 'investor':
      case 'property_manager':
        return properties;
      case 'tenant':
        const tenantData = tenants.find(t => t.id === user.id);
        return tenantData
          ? properties.filter(p => p.id === tenantData.propertyId)
          : [];
      case 'maintenance':
        // Maintenance staff can see all properties they have tasks in
        const maintenancePropertyIds = [...new Set(
          maintenanceRequests
            .filter(req => req.assignedTo === user.id)
            .map(req => req.propertyId)
        )];
        return properties.filter(p => maintenancePropertyIds.includes(p.id));
      default:
        return [];
    }
  })();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}!
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {userStats.map((stat, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.change && (
                  <p className={`text-xs ${
                    stat.changeType === 'increase' ? 'text-app-green' :
                    stat.changeType === 'decrease' ? 'text-app-red' :
                    'text-gray-500'
                  }`}>
                    {stat.changeType === 'increase' && <ArrowUp className="inline h-3 w-3 mr-1" />}
                    {stat.changeType === 'decrease' && <ArrowDown className="inline h-3 w-3 mr-1" />}
                    {stat.change} from last month
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="activities">Recent Activities</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
                <CardDescription>
                  {user.role === 'investor' && 'Your investment portfolio at a glance'}
                  {user.role === 'property_manager' && 'Property management overview'}
                  {user.role === 'tenant' && 'Your tenant information'}
                  {user.role === 'maintenance' && 'Your maintenance tasks'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <OverviewContent userRole={user.role} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="properties" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userProperties.map((property) => (
                <Card key={property.id}>
                  <CardContent className="p-0">
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                      <img
                        src={property.imageUrl}
                        alt={property.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{property.name}</h3>
                      <p className="text-sm text-gray-500">{property.address}</p>
                      <div className="mt-2 flex items-center text-sm">
                        <Building2 className="mr-1 h-4 w-4 text-app-blue" />
                        <span>{property.units} units</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>
                  Your latest updates and notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ActivitiesContent activities={getRecentActivities()} userRole={user.role} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

// Overview content component based on user role
const OverviewContent = ({ userRole }: { userRole: string }) => {
  switch (userRole) {
    case 'investor':
      return (
        <div className="space-y-4">
          <div className="rounded-lg border bg-gray-50 p-4">
            <h3 className="font-medium text-gray-700">Portfolio Value</h3>
            <div className="mt-2 flex items-baseline">
              <span className="text-3xl font-bold">$3.2M</span>
              <span className="ml-2 text-sm text-app-green">+4.5% from last year</span>
            </div>
            <p className="mt-1 text-sm text-gray-500">Across 3 properties</p>
          </div>
          
          <div className="rounded-lg border bg-gray-50 p-4">
            <h3 className="font-medium text-gray-700">Annual Return</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold">12.7%</span>
            </div>
            <p className="mt-1 text-sm text-gray-500">Year to date</p>
          </div>
        </div>
      );

    case 'property_manager':
      return (
        <div className="space-y-4">
          <div className="rounded-lg border bg-gray-50 p-4">
            <h3 className="font-medium text-gray-700">Properties Overview</h3>
            <div className="mt-2">
              <div className="flex justify-between text-sm">
                <span>Total Units:</span>
                <span className="font-medium">78</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Occupied:</span>
                <span className="font-medium">73 (94%)</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Vacant:</span>
                <span className="font-medium">5 (6%)</span>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border bg-gray-50 p-4">
            <h3 className="font-medium text-gray-700">Upcoming Deadlines</h3>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tax Filing:</span>
                <span className="font-medium">Apr 15, 2023</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Building Inspection:</span>
                <span className="font-medium">May 10, 2023</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>License Renewal:</span>
                <span className="font-medium">Jun 30, 2023</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'tenant':
      return (
        <div className="space-y-4">
          <div className="rounded-lg border bg-gray-50 p-4">
            <h3 className="font-medium text-gray-700">Your Apartment</h3>
            <div className="mt-2">
              <div className="flex justify-between text-sm">
                <span>Property:</span>
                <span className="font-medium">Sunset Apartments</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Unit Number:</span>
                <span className="font-medium">101</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Lease Period:</span>
                <span className="font-medium">Jan 1, 2023 - Jan 1, 2024</span>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border bg-gray-50 p-4">
            <h3 className="font-medium text-gray-700">Rent Information</h3>
            <div className="mt-2">
              <div className="flex justify-between text-sm">
                <span>Monthly Rent:</span>
                <span className="font-medium">$1,450</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Next Due Date:</span>
                <span className="font-medium">May 1, 2023</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Payment Status:</span>
                <span className="font-medium text-app-green">Paid for April</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'maintenance':
      return (
        <div className="space-y-4">
          <div className="rounded-lg border bg-gray-50 p-4">
            <h3 className="font-medium text-gray-700">Maintenance Queue</h3>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-app-red mr-2"></span>
                  High Priority:
                </span>
                <span className="font-medium">1 task</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-app-amber mr-2"></span>
                  Medium Priority:
                </span>
                <span className="font-medium">2 tasks</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-app-green mr-2"></span>
                  Low Priority:
                </span>
                <span className="font-medium">1 task</span>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border bg-gray-50 p-4">
            <h3 className="font-medium text-gray-700">Today's Schedule</h3>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between text-sm">
                <span>9:00 AM:</span>
                <span className="font-medium">Fix leaking faucet (Unit 101)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>11:30 AM:</span>
                <span className="font-medium">HVAC inspection (Unit 205)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>2:00 PM:</span>
                <span className="font-medium">Replace window (Unit 108)</span>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return <div>No overview content available</div>;
  }
};

// Activities content based on user role
const ActivitiesContent = ({ activities, userRole }: { activities: any[], userRole: string }) => {
  if (activities.length === 0) {
    return <p className="text-gray-500">No recent activities</p>;
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        let icon, content;

        switch (activity.type) {
          case 'income':
            icon = <ArrowUp className="h-5 w-5 text-app-green" />;
            content = (
              <>
                <div className="font-medium">{activity.title}</div>
                <div className="text-sm text-gray-500">{activity.date}</div>
                <div className="text-app-green font-medium">{activity.amount}</div>
              </>
            );
            break;
          case 'expense':
            icon = <ArrowDown className="h-5 w-5 text-app-red" />;
            content = (
              <>
                <div className="font-medium">{activity.title}</div>
                <div className="text-sm text-gray-500">{activity.date}</div>
                <div className="text-app-red font-medium">{activity.amount}</div>
              </>
            );
            break;
          case 'maintenance':
            icon = <Wrench className="h-5 w-5 text-app-blue" />;
            content = userRole === 'maintenance' ? (
              <>
                <div className="font-medium">{activity.title}</div>
                <div className="text-sm text-gray-500">{activity.property} - Unit {activity.unit}</div>
                <div className={`text-xs rounded-full px-2 py-0.5 inline-block mt-1 ${
                  activity.priority === 'high' ? 'bg-app-red/10 text-app-red' :
                  activity.priority === 'medium' ? 'bg-app-amber/10 text-app-amber' :
                  'bg-app-green/10 text-app-green'
                }`}>
                  {activity.priority} priority
                </div>
              </>
            ) : (
              <>
                <div className="font-medium">{activity.title}</div>
                <div className="text-sm text-gray-500">{activity.date}</div>
                <div className={`text-xs rounded-full px-2 py-0.5 inline-block mt-1 ${
                  activity.status === 'pending' ? 'bg-app-amber/10 text-app-amber' :
                  activity.status === 'in_progress' ? 'bg-app-blue/10 text-app-blue' :
                  activity.status === 'completed' ? 'bg-app-green/10 text-app-green' :
                  'bg-gray-300/10 text-gray-500'
                }`}>
                  {activity.status.replace('_', ' ')}
                </div>
              </>
            );
            break;
          case 'showing':
            icon = <Calendar className="h-5 w-5 text-app-blue" />;
            content = (
              <>
                <div className="font-medium">{activity.title}</div>
                <div className="text-sm text-gray-500">{activity.date}</div>
                <div className="text-sm">
                  Prospect: {activity.prospect}
                </div>
              </>
            );
            break;
          default:
            icon = <BarChart3 className="h-5 w-5 text-gray-500" />;
            content = (
              <>
                <div className="font-medium">{activity.title}</div>
                <div className="text-sm text-gray-500">{activity.date}</div>
              </>
            );
        }

        return (
          <div key={activity.id} className="flex space-x-4 rounded-lg border bg-white p-4">
            <div className="flex-shrink-0 mt-1">{icon}</div>
            <div className="flex-grow">{content}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;
