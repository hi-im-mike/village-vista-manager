
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Bell,
  Search,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function AppHeader() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const roleDisplay = {
    investor: 'Investor',
    property_manager: 'Property Manager',
    tenant: 'Tenant',
    potential_tenant: 'Potential Tenant',
    maintenance: 'Maintenance Staff',
  };

  return (
    <header className="z-10 py-4 bg-white shadow-sm border-b">
      <div className="container flex items-center justify-between h-full px-6 mx-auto">
        {/* Mobile hamburger, visible on mobile only */}
        <SidebarTriggerMobile />
        
        {/* Search */}
        <div className="flex items-center flex-1 justify-center lg:justify-end">
          <div className="relative w-full max-w-xl mr-6 focus-within:text-app-blue hidden md:block">
            <div className="absolute inset-y-0 flex items-center left-0 pl-2">
              <Search className="w-4 h-4" />
            </div>
            <input
              className="w-full pl-8 pr-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-gray-500 focus:bg-white focus:border-app-blue focus:outline-none form-input"
              type="text"
              placeholder="Search for properties, tenants..."
              aria-label="Search"
            />
          </div>

          {/* Notifications and user profile */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute h-2 w-2 rounded-full bg-app-red top-1 right-1"></span>
            </Button>
            
            {/* User profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user.name}</span>
                    <span className="text-xs text-gray-500">{roleDisplay[user.role as keyof typeof roleDisplay]}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => {}}>Profile</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => {}}>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

// Mobile sidebar trigger
const SidebarTriggerMobile = () => {
  return (
    <SidebarTrigger className="lg:hidden" />
  );
};
