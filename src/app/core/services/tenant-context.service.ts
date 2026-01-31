import { Injectable, signal, computed } from '@angular/core';
import { Observable, BehaviorSubject, map } from 'rxjs';
import type { Tenant } from '../models/tenant.model';

/**
 * TenantContextService — Central service for tenant isolation.
 * All tenant-aware data access MUST go through this service.
 * Ensures data never leaks across tenant boundaries.
 */
@Injectable({ providedIn: 'root' })
export class TenantContextService {
  private readonly _currentTenant = new BehaviorSubject<Tenant | null>(null);
  private readonly _availableTenants = new BehaviorSubject<Tenant[]>([]);

  readonly currentTenant$ = this._currentTenant.asObservable();
  readonly availableTenants$ = this._availableTenants.asObservable();

  readonly currentTenant = signal<Tenant | null>(null);
  readonly tenantId = computed(() => this.currentTenant()?.id ?? null);
  readonly tenantName = computed(() => this.currentTenant()?.name ?? 'No Tenant');
  readonly tenantPlan = computed(() => this.currentTenant()?.plan ?? 'free');

  constructor() {
    this._currentTenant.pipe(
      map((t) => t ?? null)
    ).subscribe((t) => this.currentTenant.set(t));
  }

  setCurrentTenant(tenant: Tenant | null): void {
    this._currentTenant.next(tenant);
  }

  setAvailableTenants(tenants: Tenant[]): void {
    this._availableTenants.next(tenants);
  }

  switchTenant(tenantId: string): boolean {
    const tenant = this._availableTenants.value.find((t) => t.id === tenantId);
    if (tenant) {
      this.setCurrentTenant(tenant);
      return true;
    }
    return false;
  }

  getTenantId(): string | null {
    return this._currentTenant.value?.id ?? null;
  }

  getTenantStorageKey(prefix: string): string {
    const id = this.getTenantId();
    if (!id) return prefix;
    return `tenant:${id}:${prefix}`;
  }

  isTenantActive(): boolean {
    return this._currentTenant.value !== null;
  }
}
