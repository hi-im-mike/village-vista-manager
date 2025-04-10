
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { 
  Home, 
  BarChart3, 
  Building2, 
  Users, 
  Calendar, 
  Wrench, 
  FileText, 
  LogOut 
} from 'lucide-react';

export function AppSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    {
      label: 'Dashboard',
      icon: Home,
      href: '/',
      roles: ['investor', 'property_manager', 'tenant', 'maintenance'],
    },
    {
      label: 'Reports',
      icon: BarChart3,
      href: '/reports',
      roles: ['investor', 'property_manager'],
    },
    {
      label: 'Properties',
      icon: Building2,
      href: '/properties',
      roles: ['investor', 'property_manager', 'tenant', 'maintenance'],
    },
    {
      label: 'Tenants',
      icon: Users,
      href: '/tenants',
      roles: ['property_manager'],
    },
    {
      label: 'Showings',
      icon: Calendar,
      href: '/showings',
      roles: ['property_manager', 'potential_tenant'],
    },
    {
      label: 'Maintenance',
      icon: Wrench,
      href: '/maintenance',
      roles: ['property_manager', 'tenant', 'maintenance'],
    },
    {
      label: 'Documents',
      icon: FileText,
      href: '/documents',
      roles: ['investor', 'property_manager', 'tenant'],
    },
  ];

  // Filter nav items based on user role
  const filteredNavItems = user
    ? navItems.filter(item => item.roles.includes(user.role))
    : [];

  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/" className="flex items-center space-x-2">
          <Building2 className="h-6 w-6 text-app-blue" />
          <span className="text-lg font-bold">Village Vista</span>
        </Link>
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupLabel>
            {user?.role === 'investor' && 'Investor Portal'}
            {user?.role === 'property_manager' && 'Property Management'}
            {user?.role === 'tenant' && 'Tenant Portal'}
            {user?.role === 'maintenance' && 'Maintenance Portal'}
            {user?.role === 'potential_tenant' && 'Prospect Portal'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild active={location.pathname === item.href}>
                    <Link to={item.href} className="flex items-center">
                      <item.icon className="mr-3 h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={logout}>
                  <div className="flex items-center">
                    <LogOut className="mr-3 h-5 w-5" />
                    <span>Logout</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
