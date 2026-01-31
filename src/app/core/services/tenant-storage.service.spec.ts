import { TestBed } from '@angular/core/testing';
import { TenantStorageService } from './tenant-storage.service';
import { TenantContextService } from './tenant-context.service';
import type { Tenant } from '../models/tenant.model';

describe('TenantStorageService', () => {
  let service: TenantStorageService;
  let tenantContext: TenantContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TenantStorageService);
    tenantContext = TestBed.inject(TenantContextService);
    tenantContext.setCurrentTenant({
      id: 'tenant-a',
      name: 'A',
      slug: 'a',
      plan: 'free',
      status: 'active',
      createdAt: new Date(),
    });
    localStorage.clear();
  });

  it('should store and retrieve tenant-scoped data', () => {
    service.setItem('key1', { foo: 'bar' });
    expect(service.getItem<{ foo: string }>('key1')).toEqual({ foo: 'bar' });
  });

  it('should use tenant-prefixed keys', () => {
    service.setItem('test', 'value');
    expect(localStorage.getItem('tenant:tenant-a:test')).toBe('"value"');
  });

  it('should not leak across tenants', () => {
    service.setItem('secret', 'tenant-a-data');
    tenantContext.setCurrentTenant({
      id: 'tenant-b',
      name: 'B',
      slug: 'b',
      plan: 'free',
      status: 'active',
      createdAt: new Date(),
    });
    expect(service.getItem<string>('secret')).toBeNull();
  });
});
