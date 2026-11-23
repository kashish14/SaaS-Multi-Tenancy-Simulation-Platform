import { Injectable } from '@angular/core';
import { TenantContextService } from './tenant-context.service';

/**
 * TenantStorageService — Tenant-scoped storage.
 * All keys are prefixed with tenant ID to prevent data leakage.
 * Uses localStorage for persistence across sessions.
 */
@Injectable({ providedIn: 'root' })
export class TenantStorageService {
  constructor(private readonly tenantContext: TenantContextService) {}

  getItem<T>(key: string): T | null {
    const tenantKey = this.tenantContext.getTenantStorageKey(key);
    const raw = localStorage.getItem(tenantKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as unknown as T;
    }
  }

  setItem<T>(key: string, value: T): void {
    const tenantKey = this.tenantContext.getTenantStorageKey(key);
    localStorage.setItem(tenantKey, JSON.stringify(value));
  }

  removeItem(key: string): void {
    const tenantKey = this.tenantContext.getTenantStorageKey(key);
    localStorage.removeItem(tenantKey);
  }

  /** All storage keys owned by the active tenant. */
  keys(): string[] {
    const tenantId = this.tenantContext.getTenantId();
    if (!tenantId) return [];
    const prefix = `tenant:${tenantId}:`;
    return Object.keys(localStorage).filter((k) => k.startsWith(prefix));
  }

  clear(): void {
    this.keys().forEach((k) => localStorage.removeItem(k));
  }
}
