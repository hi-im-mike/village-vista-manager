
import { UserRole } from '@/types/auth';

export type Property = {
  id: string;
  name: string;
  address: string;
  units: number;
  imageUrl: string;
};

export type MaintenanceRequest = {
  id: string;
  propertyId: string;
  unitNumber: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'emergency';
  createdAt: string;
  createdBy: string;
  assignedTo?: string;
  images?: string[];
  comments?: {
    id: string;
    text: string;
    createdAt: string;
    createdBy: string;
  }[];
};

export type Showing = {
  id: string;
  propertyId: string;
  unitNumber: string;
  date: string;
  time: string;
  prospectName: string;
  prospectEmail: string;
  prospectPhone: string;
  status: 'scheduled' | 'completed' | 'cancelled';
};

export type FinancialRecord = {
  id: string;
  propertyId: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
};

export type Tenant = {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  unitNumber: string;
  leaseStart: string;
  leaseEnd: string;
};

export type Document = {
  id: string;
  title: string;
  type: 'lease' | 'tax' | 'permit' | 'license' | 'other';
  relatedTo: string; // propertyId or tenantId
  fileUrl: string;
  uploadDate: string;
  expiryDate?: string;
};

// Mock Properties
export const properties: Property[] = [
  {
    id: 'prop1',
    name: 'Sunset Apartments',
    address: '123 Sunset Blvd, Los Angeles, CA 90001',
    units: 24,
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YXBhcnRtZW50JTIwYnVpbGRpbmd8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80',
  },
  {
    id: 'prop2',
    name: 'Ocean View Condos',
    address: '456 Ocean Drive, Miami, FL 33139',
    units: 36,
    imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8aG91c2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80',
  },
  {
    id: 'prop3',
    name: 'Mountain Terrace',
    address: '789 Alpine Way, Denver, CO 80201',
    units: 18,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aG9tZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
  },
];

// Mock Maintenance Requests
export const maintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'maint1',
    propertyId: 'prop1',
    unitNumber: '101',
    title: 'Leaking Faucet',
    description: 'The bathroom sink faucet is leaking continuously.',
    status: 'pending',
    priority: 'medium',
    createdAt: '2023-04-05T10:30:00Z',
    createdBy: '3', // tenant id
    images: ['https://images.unsplash.com/photo-1585704032915-c3400ca199e7?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bGVha2luZyUyMGZhdWNldHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80'],
    comments: [
      {
        id: 'comment1',
        text: 'I\'ll check it tomorrow morning.',
        createdAt: '2023-04-05T14:20:00Z',
        createdBy: '4', // maintenance id
      },
    ],
  },
  {
    id: 'maint2',
    propertyId: 'prop2',
    unitNumber: '205',
    title: 'Air Conditioning Not Working',
    description: 'The AC unit is not cooling properly. It makes a buzzing noise but doesn\'t cool.',
    status: 'in_progress',
    priority: 'high',
    createdAt: '2023-04-03T09:15:00Z',
    createdBy: '3', // tenant id
    assignedTo: '4', // maintenance id
  },
  {
    id: 'maint3',
    propertyId: 'prop1',
    unitNumber: '108',
    title: 'Broken Window',
    description: 'The window in the bedroom is cracked and needs replacement.',
    status: 'completed',
    priority: 'medium',
    createdAt: '2023-03-28T16:45:00Z',
    createdBy: '3', // tenant id
    assignedTo: '4', // maintenance id
    comments: [
      {
        id: 'comment2',
        text: 'Ordered replacement glass, will install when it arrives.',
        createdAt: '2023-03-29T10:20:00Z',
        createdBy: '4', // maintenance id
      },
      {
        id: 'comment3',
        text: 'Window has been replaced and sealed.',
        createdAt: '2023-04-02T13:40:00Z',
        createdBy: '4', // maintenance id
      },
    ],
  },
];

// Mock Showings
export const showings: Showing[] = [
  {
    id: 'show1',
    propertyId: 'prop1',
    unitNumber: '103',
    date: '2023-04-12',
    time: '10:00',
    prospectName: 'Alex Johnson',
    prospectEmail: 'alex@example.com',
    prospectPhone: '555-123-4567',
    status: 'scheduled',
  },
  {
    id: 'show2',
    propertyId: 'prop3',
    unitNumber: '302',
    date: '2023-04-13',
    time: '15:30',
    prospectName: 'Taylor Smith',
    prospectEmail: 'taylor@example.com',
    prospectPhone: '555-987-6543',
    status: 'scheduled',
  },
  {
    id: 'show3',
    propertyId: 'prop2',
    unitNumber: '210',
    date: '2023-04-10',
    time: '12:00',
    prospectName: 'Jordan Lee',
    prospectEmail: 'jordan@example.com',
    prospectPhone: '555-456-7890',
    status: 'completed',
  },
];

// Mock Financial Records
export const financialRecords: FinancialRecord[] = [
  {
    id: 'fin1',
    propertyId: 'prop1',
    type: 'income',
    category: 'Rent',
    amount: 12000,
    date: '2023-04-01',
    description: 'Monthly rent collection',
  },
  {
    id: 'fin2',
    propertyId: 'prop1',
    type: 'expense',
    category: 'Maintenance',
    amount: 2500,
    date: '2023-04-03',
    description: 'Plumbing repairs',
  },
  {
    id: 'fin3',
    propertyId: 'prop2',
    type: 'income',
    category: 'Rent',
    amount: 15500,
    date: '2023-04-01',
    description: 'Monthly rent collection',
  },
  {
    id: 'fin4',
    propertyId: 'prop2',
    type: 'expense',
    category: 'Utilities',
    amount: 1800,
    date: '2023-04-05',
    description: 'Water and electricity',
  },
  {
    id: 'fin5',
    propertyId: 'prop3',
    type: 'income',
    category: 'Rent',
    amount: 9000,
    date: '2023-04-01',
    description: 'Monthly rent collection',
  },
  {
    id: 'fin6',
    propertyId: 'prop3',
    type: 'expense',
    category: 'Taxes',
    amount: 3200,
    date: '2023-04-10',
    description: 'Property taxes',
  },
];

// Mock Tenants
export const tenants: Tenant[] = [
  {
    id: 'ten1',
    name: 'Emily Brown',
    email: 'emily@example.com',
    phone: '555-111-2222',
    propertyId: 'prop1',
    unitNumber: '101',
    leaseStart: '2023-01-01',
    leaseEnd: '2024-01-01',
  },
  {
    id: 'ten2',
    name: 'David Wilson',
    email: 'david@example.com',
    phone: '555-333-4444',
    propertyId: 'prop1',
    unitNumber: '102',
    leaseStart: '2022-08-15',
    leaseEnd: '2023-08-15',
  },
  {
    id: 'ten3',
    name: 'Sophia Martinez',
    email: 'sophia@example.com',
    phone: '555-555-6666',
    propertyId: 'prop2',
    unitNumber: '205',
    leaseStart: '2022-11-01',
    leaseEnd: '2023-11-01',
  },
];

// Mock Documents
export const documents: Document[] = [
  {
    id: 'doc1',
    title: 'Lease Agreement - Emily Brown',
    type: 'lease',
    relatedTo: 'ten1',
    fileUrl: '/documents/lease_emily_brown.pdf',
    uploadDate: '2023-01-01',
    expiryDate: '2024-01-01',
  },
  {
    id: 'doc2',
    title: 'Property Tax Bill - Sunset Apartments',
    type: 'tax',
    relatedTo: 'prop1',
    fileUrl: '/documents/tax_sunset_apartments.pdf',
    uploadDate: '2023-02-15',
    expiryDate: '2023-12-31',
  },
  {
    id: 'doc3',
    title: 'Building Permit - Ocean View Renovation',
    type: 'permit',
    relatedTo: 'prop2',
    fileUrl: '/documents/permit_ocean_view.pdf',
    uploadDate: '2023-03-10',
    expiryDate: '2023-09-10',
  },
  {
    id: 'doc4',
    title: 'Business License - Mountain Terrace',
    type: 'license',
    relatedTo: 'prop3',
    fileUrl: '/documents/license_mountain_terrace.pdf',
    uploadDate: '2023-01-20',
    expiryDate: '2024-01-20',
  },
];
