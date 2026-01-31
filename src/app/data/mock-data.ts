import type { Tenant } from '../core/models/tenant.model';
import type { User } from '../core/models/user.model';

/**
 * Mock data — Simulated tenants, users, projects, and activity for multi-tenancy demonstration.
 * In production, this would come from a secure backend.
 */

export interface MockProject {
  id: string;
  tenantId: string;
  name: string;
  status: 'active' | 'archived' | 'draft';
  createdAt: Date;
  lastActivity: Date;
}

export interface MockActivity {
  id: string;
  tenantId: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  timestamp: Date;
}

export const MOCK_TENANTS: Tenant[] = [
  {
    id: 'tenant-acme',
    name: 'Acme Corp',
    slug: 'acme',
    plan: 'enterprise',
    status: 'active',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'tenant-globex',
    name: 'Globex Industries',
    slug: 'globex',
    plan: 'pro',
    status: 'active',
    createdAt: new Date('2024-03-01'),
  },
  {
    id: 'tenant-initech',
    name: 'Initech',
    slug: 'initech',
    plan: 'free',
    status: 'active',
    createdAt: new Date('2024-05-20'),
  },
  {
    id: 'tenant-umbrella',
    name: 'Umbrella Labs',
    slug: 'umbrella',
    plan: 'pro',
    status: 'trial',
    createdAt: new Date('2024-06-10'),
  },
  {
    id: 'tenant-wonka',
    name: 'Wonka Industries',
    slug: 'wonka',
    plan: 'enterprise',
    status: 'active',
    createdAt: new Date('2024-02-28'),
  },
  {
    id: 'tenant-stark',
    name: 'Stark Innovations',
    slug: 'stark',
    plan: 'pro',
    status: 'active',
    createdAt: new Date('2024-04-12'),
  },
  {
    id: 'tenant-wayne',
    name: 'Wayne Enterprises',
    slug: 'wayne',
    plan: 'free',
    status: 'trial',
    createdAt: new Date('2024-07-01'),
  },
];

export const MOCK_USERS: User[] = [
  { id: 'user-1', email: 'admin@acme.com', name: 'Alice Admin', role: 'admin', tenantId: 'tenant-acme' },
  { id: 'user-2', email: 'manager@acme.com', name: 'Bob Manager', role: 'manager', tenantId: 'tenant-acme' },
  { id: 'user-3', email: 'user@acme.com', name: 'Carol User', role: 'user', tenantId: 'tenant-acme' },
  { id: 'user-4', email: 'dev@acme.com', name: 'Dave Developer', role: 'user', tenantId: 'tenant-acme' },
  { id: 'user-5', email: 'support@acme.com', name: 'Eva Support', role: 'manager', tenantId: 'tenant-acme' },
  { id: 'user-6', email: 'admin@globex.com', name: 'Frank Admin', role: 'admin', tenantId: 'tenant-globex' },
  { id: 'user-7', email: 'manager@globex.com', name: 'Grace Manager', role: 'manager', tenantId: 'tenant-globex' },
  { id: 'user-8', email: 'user@globex.com', name: 'Henry User', role: 'user', tenantId: 'tenant-globex' },
  { id: 'user-9', email: 'sales@globex.com', name: 'Ivy Sales', role: 'user', tenantId: 'tenant-globex' },
  { id: 'user-10', email: 'milton@initech.com', name: 'Milton Waddams', role: 'user', tenantId: 'tenant-initech' },
  { id: 'user-11', email: 'bill@initech.com', name: 'Bill Lumbergh', role: 'manager', tenantId: 'tenant-initech' },
  { id: 'user-12', email: 'peter@initech.com', name: 'Peter Gibbons', role: 'user', tenantId: 'tenant-initech' },
  { id: 'user-13', email: 'admin@umbrella.com', name: 'Albert Wesker', role: 'admin', tenantId: 'tenant-umbrella' },
  { id: 'user-14', email: 'jill@umbrella.com', name: 'Jill Valentine', role: 'manager', tenantId: 'tenant-umbrella' },
  { id: 'user-15', email: 'chris@umbrella.com', name: 'Chris Redfield', role: 'user', tenantId: 'tenant-umbrella' },
  { id: 'user-16', email: 'wonka@wonka.com', name: 'Willy Wonka', role: 'admin', tenantId: 'tenant-wonka' },
  { id: 'user-17', email: 'oompa@wonka.com', name: 'Oompa Loompa', role: 'manager', tenantId: 'tenant-wonka' },
  { id: 'user-18', email: 'charlie@wonka.com', name: 'Charlie Bucket', role: 'user', tenantId: 'tenant-wonka' },
  { id: 'user-19', email: 'tony@stark.com', name: 'Tony Stark', role: 'admin', tenantId: 'tenant-stark' },
  { id: 'user-20', email: 'pepper@stark.com', name: 'Pepper Potts', role: 'manager', tenantId: 'tenant-stark' },
  { id: 'user-21', email: 'james@wayne.com', name: 'James Gordon', role: 'admin', tenantId: 'tenant-wayne' },
  { id: 'user-22', email: 'alfred@wayne.com', name: 'Alfred Pennyworth', role: 'manager', tenantId: 'tenant-wayne' },
];

export const MOCK_PROJECTS: MockProject[] = [
  { id: 'proj-1', tenantId: 'tenant-acme', name: 'Coyote Capture System', status: 'active', createdAt: new Date('2024-06-01'), lastActivity: new Date() },
  { id: 'proj-2', tenantId: 'tenant-acme', name: 'Anvil Delivery Network', status: 'active', createdAt: new Date('2024-05-15'), lastActivity: new Date(Date.now() - 86400000) },
  { id: 'proj-3', tenantId: 'tenant-acme', name: 'Rocket Sled v2', status: 'archived', createdAt: new Date('2024-01-20'), lastActivity: new Date(Date.now() - 604800000) },
  { id: 'proj-4', tenantId: 'tenant-globex', name: 'Nuclear Reactor Safety', status: 'active', createdAt: new Date('2024-04-01'), lastActivity: new Date() },
  { id: 'proj-5', tenantId: 'tenant-globex', name: 'Monorail Expansion', status: 'active', createdAt: new Date('2024-03-10'), lastActivity: new Date(Date.now() - 172800000) },
  { id: 'proj-6', tenantId: 'tenant-initech', name: 'TPS Report Automation', status: 'active', createdAt: new Date('2024-05-01'), lastActivity: new Date(Date.now() - 3600000) },
  { id: 'proj-7', tenantId: 'tenant-initech', name: 'Red Stapler Initiative', status: 'draft', createdAt: new Date('2024-06-15'), lastActivity: new Date(Date.now() - 259200000) },
  { id: 'proj-8', tenantId: 'tenant-umbrella', name: 'T-Virus Research', status: 'active', createdAt: new Date('2024-06-01'), lastActivity: new Date() },
  { id: 'proj-9', tenantId: 'tenant-umbrella', name: 'Raccoon City Lab', status: 'active', createdAt: new Date('2024-05-20'), lastActivity: new Date(Date.now() - 43200000) },
  { id: 'proj-10', tenantId: 'tenant-wonka', name: 'Everlasting Gobstopper', status: 'active', createdAt: new Date('2024-02-01'), lastActivity: new Date() },
  { id: 'proj-11', tenantId: 'tenant-wonka', name: 'Chocolate River', status: 'active', createdAt: new Date('2024-03-15'), lastActivity: new Date(Date.now() - 86400000) },
  { id: 'proj-12', tenantId: 'tenant-stark', name: 'Arc Reactor Mk III', status: 'active', createdAt: new Date('2024-04-01'), lastActivity: new Date() },
  { id: 'proj-13', tenantId: 'tenant-stark', name: 'J.A.R.V.I.S. 2.0', status: 'active', createdAt: new Date('2024-05-10'), lastActivity: new Date(Date.now() - 86400000) },
  { id: 'proj-14', tenantId: 'tenant-wayne', name: 'Batmobile Upgrade', status: 'draft', createdAt: new Date('2024-07-01'), lastActivity: new Date() },
];

export const MOCK_ACTIVITY: MockActivity[] = [
  { id: 'act-1', tenantId: 'tenant-acme', userId: 'user-1', userName: 'Alice Admin', action: 'created', target: 'Coyote Capture System', timestamp: new Date() },
  { id: 'act-2', tenantId: 'tenant-acme', userId: 'user-2', userName: 'Bob Manager', action: 'invited', target: 'Dave Developer', timestamp: new Date(Date.now() - 3600000) },
  { id: 'act-3', tenantId: 'tenant-acme', userId: 'user-3', userName: 'Carol User', action: 'exported', target: 'Analytics Report', timestamp: new Date(Date.now() - 7200000) },
  { id: 'act-4', tenantId: 'tenant-acme', userId: 'user-1', userName: 'Alice Admin', action: 'updated', target: 'Billing settings', timestamp: new Date(Date.now() - 86400000) },
  { id: 'act-5', tenantId: 'tenant-globex', userId: 'user-6', userName: 'Frank Admin', action: 'deployed', target: 'Monorail Expansion', timestamp: new Date() },
  { id: 'act-6', tenantId: 'tenant-globex', userId: 'user-7', userName: 'Grace Manager', action: 'approved', target: 'Budget request', timestamp: new Date(Date.now() - 1800000) },
  { id: 'act-7', tenantId: 'tenant-initech', userId: 'user-11', userName: 'Bill Lumbergh', action: 'assigned', target: 'TPS reports to Milton', timestamp: new Date(Date.now() - 5400000) },
  { id: 'act-8', tenantId: 'tenant-initech', userId: 'user-12', userName: 'Peter Gibbons', action: 'logged in', target: 'from home', timestamp: new Date(Date.now() - 3600000) },
  { id: 'act-9', tenantId: 'tenant-umbrella', userId: 'user-13', userName: 'Albert Wesker', action: 'created', target: 'T-Virus Research', timestamp: new Date() },
  { id: 'act-10', tenantId: 'tenant-umbrella', userId: 'user-14', userName: 'Jill Valentine', action: 'exported', target: 'Lab logs', timestamp: new Date(Date.now() - 7200000) },
  { id: 'act-11', tenantId: 'tenant-wonka', userId: 'user-16', userName: 'Willy Wonka', action: 'launched', target: 'Golden Ticket campaign', timestamp: new Date() },
  { id: 'act-12', tenantId: 'tenant-wonka', userId: 'user-17', userName: 'Oompa Loompa', action: 'updated', target: 'Chocolate River flow', timestamp: new Date(Date.now() - 86400000) },
  { id: 'act-13', tenantId: 'tenant-stark', userId: 'user-19', userName: 'Tony Stark', action: 'deployed', target: 'Arc Reactor Mk III', timestamp: new Date() },
  { id: 'act-14', tenantId: 'tenant-stark', userId: 'user-20', userName: 'Pepper Potts', action: 'approved', target: 'Vendor contract', timestamp: new Date(Date.now() - 3600000) },
  { id: 'act-15', tenantId: 'tenant-wayne', userId: 'user-21', userName: 'James Gordon', action: 'created', target: 'Batmobile Upgrade project', timestamp: new Date() },
];
