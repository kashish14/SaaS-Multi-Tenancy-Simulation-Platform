import { Injectable, signal, computed } from '@angular/core';
import type { SubscriptionPlan, Tenant } from '../models/tenant.model';
import { MOCK_TENANTS } from '../../data/mock-data';

export const TENANT_KEY = 'auth:current_tenant';
const TENANTS_KEY = 'platform:tenants';

/**
 * TenantContextService — Central service for tenant isolation.
 * All tenant-aware data access MUST go through this service.
 * Ensures data never leaks across tenant boundaries.
 */
@Injectable({ providedIn: 'root' })
export class TenantContextService {
  readonly currentTenant = signal<Tenant | null>(null);
  readonly availableTenants = signal<Tenant[]>(readJson<Tenant[]>(TENANTS_KEY) ?? MOCK_TENANTS);
  readonly tenantId = computed(() => this.currentTenant()?.id ?? null);
  readonly tenantName = computed(() => this.currentTenant()?.name ?? 'No Tenant');
  readonly tenantPlan = computed<SubscriptionPlan>(() => this.currentTenant()?.plan ?? 'free');

  setCurrentTenant(tenant: Tenant | null): void {
    this.currentTenant.set(tenant);
    if (tenant) localStorage.setItem(TENANT_KEY, JSON.stringify(tenant));
    else localStorage.removeItem(TENANT_KEY);
  }

  setAvailableTenants(tenants: Tenant[]): void {
    this.availableTenants.set(tenants);
    localStorage.setItem(TENANTS_KEY, JSON.stringify(tenants));
  }

  switchTenant(tenantId: string): boolean {
    const tenant = this.availableTenants().find((t) => t.id === tenantId);
    if (!tenant) return false;
    this.setCurrentTenant(tenant);
    return true;
  }

  /** Changes the subscription plan of the active tenant (simulated billing change). */
  setPlan(plan: SubscriptionPlan): void {
    const current = this.currentTenant();
    if (!current) return;
    const updated: Tenant = { ...current, plan };
    this.setAvailableTenants(this.availableTenants().map((t) => (t.id === updated.id ? updated : t)));
    this.setCurrentTenant(updated);
  }

  getTenantId(): string | null {
    return this.currentTenant()?.id ?? null;
  }

  getTenantStorageKey(prefix: string): string {
    const id = this.getTenantId();
    if (!id) return prefix;
    return `tenant:${id}:${prefix}`;
  }

  isTenantActive(): boolean {
    return this.currentTenant() !== null;
  }
}

export function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
