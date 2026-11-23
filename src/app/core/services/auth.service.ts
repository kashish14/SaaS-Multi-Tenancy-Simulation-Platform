import { Injectable, signal, computed } from '@angular/core';
import type { User, UserRole } from '../models/user.model';
import type { Tenant } from '../models/tenant.model';
import { TenantContextService, readJson, TENANT_KEY } from './tenant-context.service';

const AUTH_KEY = 'auth:current_user';

/**
 * AuthService — Simulated authentication.
 * Manages current user and integrates with tenant context.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly userRole = computed(() => this.currentUser()?.role ?? null);

  constructor(private readonly tenantContext: TenantContextService) {
    const user = readJson<User>(AUTH_KEY);
    const tenant = readJson<Tenant>(TENANT_KEY);
    if (user && tenant) {
      this.currentUser.set(user);
      // Prefer the stored tenant list entry so plan changes survive reloads.
      this.tenantContext.setCurrentTenant(
        this.tenantContext.availableTenants().find((t) => t.id === tenant.id) ?? tenant
      );
    }
  }

  login(user: User, tenant: Tenant): void {
    this.setUser(user);
    this.tenantContext.setCurrentTenant(tenant);
  }

  /** Simulates viewing the platform as a different role (RBAC demo). */
  switchRole(role: UserRole): void {
    const user = this.currentUser();
    if (user) this.setUser({ ...user, role });
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem(AUTH_KEY);
    this.tenantContext.setCurrentTenant(null);
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  private setUser(user: User): void {
    this.currentUser.set(user);
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  }
}
