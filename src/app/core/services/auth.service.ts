import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import type { User } from '../models/user.model';
import type { Tenant } from '../models/tenant.model';
import { TenantContextService } from './tenant-context.service';
import { MOCK_TENANTS } from '../../data/mock-data';

const AUTH_KEY = 'auth:current_user';
const TENANT_KEY = 'auth:current_tenant';

/**
 * AuthService — Simulated authentication.
 * Manages current user and integrates with tenant context.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _currentUser = new BehaviorSubject<User | null>(null);

  readonly currentUser$ = this._currentUser.asObservable();
  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly userRole = computed(() => this.currentUser()?.role ?? null);

  constructor(private readonly tenantContext: TenantContextService) {
    this._currentUser.pipe(
      tap((u) => this.currentUser.set(u))
    ).subscribe();
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const userJson = localStorage.getItem(AUTH_KEY);
      const tenantJson = localStorage.getItem(TENANT_KEY);
      if (userJson) {
        const user = JSON.parse(userJson) as User;
        if (user.lastActiveAt) user.lastActiveAt = new Date(user.lastActiveAt);
        this._currentUser.next(user);
      }
      if (tenantJson) {
        const tenant = JSON.parse(tenantJson) as Tenant;
        if (tenant.createdAt) tenant.createdAt = new Date(tenant.createdAt);
        this.tenantContext.setCurrentTenant(tenant);
        this.tenantContext.setAvailableTenants(MOCK_TENANTS);
      }
    } catch {
      // ignore
    }
  }

  login(user: User, tenant: Tenant): void {
    this._currentUser.next(user);
    this.tenantContext.setCurrentTenant(tenant);
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    localStorage.setItem(TENANT_KEY, JSON.stringify(tenant));
  }

  logout(): void {
    this._currentUser.next(null);
    this.tenantContext.setCurrentTenant(null);
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(TENANT_KEY);
  }

  getCurrentUser(): User | null {
    return this._currentUser.value;
  }
}
