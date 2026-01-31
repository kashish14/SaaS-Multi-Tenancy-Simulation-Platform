/**
 * User model — users belong to tenants and have role-based permissions.
 */
import type { Tenant } from './tenant.model';

export type UserRole = 'admin' | 'manager' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId: string;
  tenant?: Tenant;
  lastActiveAt?: Date;
}
