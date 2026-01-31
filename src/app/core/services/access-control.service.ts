import { Injectable } from '@angular/core';
import { ROLE_PERMISSIONS, type Permission } from '../models/permission.model';
import { AuthService } from './auth.service';

/**
 * AccessControlService — RBAC enforcement.
 * Checks permissions against the current user's role.
 */
@Injectable({ providedIn: 'root' })
export class AccessControlService {
  constructor(private readonly auth: AuthService) {}

  hasPermission(permission: Permission): boolean {
    const role = this.auth.userRole();
    if (!role) return false;
    const allowed = ROLE_PERMISSIONS[role] ?? [];
    return allowed.includes(permission);
  }

  hasAnyRole(...roles: string[]): boolean {
    const role = this.auth.userRole();
    if (!role) return false;
    return roles.includes(role);
  }

  hasAllRoles(...roles: string[]): boolean {
    const role = this.auth.userRole();
    if (!role) return false;
    return roles.every((r) => r === role); // simplified: check if current role is in list
  }

  canAccessRoute(requiredRoles: string[]): boolean {
    return this.hasAnyRole(...requiredRoles);
  }
}
