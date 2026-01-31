import { TestBed } from '@angular/core/testing';
import { BillingService } from './billing.service';
import { TenantContextService } from './tenant-context.service';
import type { Tenant } from '../models/tenant.model';

describe('BillingService', () => {
  let service: BillingService;
  let tenantContext: TenantContextService;

  const setTenant = (plan: 'free' | 'pro' | 'enterprise') => {
    tenantContext.setCurrentTenant({
      id: 't1',
      name: 'T',
      slug: 't',
      plan,
      status: 'active',
      createdAt: new Date(),
    });
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillingService);
    tenantContext = TestBed.inject(TenantContextService);
  });

  it('should return plan configs', () => {
    const free = service.getPlanConfig('free');
    expect(free.maxUsers).toBe(3);
    expect(free.maxStorageGB).toBe(1);
    expect(free.price).toBe(0);

    const enterprise = service.getPlanConfig('enterprise');
    expect(enterprise.maxUsers).toBe(-1);
    expect(enterprise.maxStorageGB).toBe(-1);
  });

  it('should gate advanced analytics for free plan', () => {
    setTenant('free');
    expect(service.isFeatureAvailable('advancedAnalytics')).toBe(false);
    setTenant('pro');
    expect(service.isFeatureAvailable('advancedAnalytics')).toBe(true);
    setTenant('enterprise');
    expect(service.isFeatureAvailable('advancedAnalytics')).toBe(true);
  });

  it('should return billing summary', (done) => {
    setTenant('pro');
    service.getBillingSummary().subscribe((summary) => {
      expect(summary.plan).toBe('pro');
      expect(summary.monthlyAmount).toBeGreaterThanOrEqual(0);
      expect(summary.usage).toBeDefined();
      done();
    });
  });
});
