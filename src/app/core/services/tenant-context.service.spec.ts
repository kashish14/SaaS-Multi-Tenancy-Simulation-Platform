import { TestBed } from '@angular/core/testing';
import { TenantContextService } from './tenant-context.service';
import type { Tenant } from '../models/tenant.model';

describe('TenantContextService', () => {
  let service: TenantContextService;
  const mockTenant: Tenant = {
    id: 'tenant-1',
    name: 'Test Tenant',
    slug: 'test',
    plan: 'pro',
    status: 'active',
    createdAt: new Date(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TenantContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with no tenant', () => {
    expect(service.getTenantId()).toBeNull();
    expect(service.currentTenant()).toBeNull();
  });

  it('should set and get current tenant', () => {
    service.setCurrentTenant(mockTenant);
    expect(service.getTenantId()).toBe('tenant-1');
    expect(service.currentTenant()?.name).toBe('Test Tenant');
  });

  it('should prefix storage keys with tenant ID for isolation', () => {
    service.setCurrentTenant(mockTenant);
    const key = service.getTenantStorageKey('preferences');
    expect(key).toBe('tenant:tenant-1:preferences');
  });

  it('should return plain prefix when no tenant', () => {
    service.setCurrentTenant(null);
    const key = service.getTenantStorageKey('preferences');
    expect(key).toBe('preferences');
  });

  it('should switch tenant by ID', () => {
    service.setAvailableTenants([mockTenant]);
    service.setCurrentTenant(mockTenant);
    const other: Tenant = { ...mockTenant, id: 'tenant-2', name: 'Other' };
    service.setAvailableTenants([mockTenant, other]);

    expect(service.switchTenant('tenant-2')).toBe(true);
    expect(service.getTenantId()).toBe('tenant-2');
    expect(service.switchTenant('nonexistent')).toBe(false);
  });
});
