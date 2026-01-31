/**
 * Permission model — RBAC permission matrix.
 * Maps roles to allowed actions and resources.
 */
export type Permission =
  | 'dashboard.view'
  | 'users.view'
  | 'users.create'
  | 'users.edit'
  | 'users.delete'
  | 'analytics.view'
  | 'analytics.export'
  | 'billing.view'
  | 'billing.manage'
  | 'settings.view'
  | 'settings.manage'
  | 'platform.admin';

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: [
    'dashboard.view',
    'users.view',
    'users.create',
    'users.edit',
    'users.delete',
    'analytics.view',
    'analytics.export',
    'billing.view',
    'billing.manage',
    'settings.view',
    'settings.manage',
    'platform.admin',
  ],
  manager: [
    'dashboard.view',
    'users.view',
    'users.create',
    'users.edit',
    'analytics.view',
    'analytics.export',
    'billing.view',
  ],
  user: ['dashboard.view', 'analytics.view', 'billing.view'],
};
