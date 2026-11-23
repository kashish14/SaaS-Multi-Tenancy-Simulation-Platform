import { Injectable, computed } from '@angular/core';
import { Observable, of, delay, tap } from 'rxjs';
import type { SubscriptionPlan } from '../models/tenant.model';
import { TenantContextService } from './tenant-context.service';
import { RateLimitService } from './rate-limit.service';

export interface SubscriptionPlanConfig {
  id: SubscriptionPlan;
  name: string;
  price: number;
  currency: string;
  maxUsers: number;
  maxStorageGB: number;
  features: string[];
}

export interface UsageMetrics {
  users: number;
  storageGB: number;
  apiCalls: number;
  month: string;
}

export interface BillingSummary {
  plan: SubscriptionPlan;
  monthlyAmount: number;
  usage: UsageMetrics;
  overages: { [key: string]: number };
}

const PLANS: Record<SubscriptionPlan, SubscriptionPlanConfig> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    maxUsers: 3,
    maxStorageGB: 1,
    features: ['Basic dashboard', '1 GB storage', 'Community support'],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 49,
    currency: 'USD',
    maxUsers: 25,
    maxStorageGB: 50,
    features: ['All Free features', 'Advanced analytics', 'Email support', '50 GB storage'],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    currency: 'USD',
    maxUsers: -1,
    maxStorageGB: -1,
    features: ['All Pro features', 'Unlimited users', 'Unlimited storage', 'SLA', 'Dedicated support'],
  },
};

/**
 * BillingService — Subscription and usage simulation.
 * Feature gating and limits are enforced per plan.
 */
@Injectable({ providedIn: 'root' })
export class BillingService {
  /** Usage is derived from the active tenant, so it updates on every tenant switch. */
  private readonly _usage = computed<UsageMetrics>(() => {
    const tenantId = this.tenantContext.tenantId();
    const hash = tenantId ? this.hash(tenantId) : 0;
    return {
      users: 5 + (hash % 20),
      storageGB: 2 + (hash % 30),
      apiCalls: 10000 + (hash % 90000),
      month: new Date().toISOString().slice(0, 7),
    };
  });

  readonly plans = PLANS;
  readonly usage = this._usage;
  readonly currentPlanConfig = computed(() => {
    const plan = this.tenantContext.tenantPlan();
    return PLANS[plan];
  });

  constructor(
    private readonly tenantContext: TenantContextService,
    private readonly rateLimit: RateLimitService
  ) {}

  getPlanConfig(plan: SubscriptionPlan): SubscriptionPlanConfig {
    return PLANS[plan];
  }

  isFeatureAvailable(feature: keyof UsageMetrics | 'advancedAnalytics'): boolean {
    const config = this.currentPlanConfig();
    const usage = this._usage();
    if (!config) return false;

    switch (feature) {
      case 'users':
        return config.maxUsers < 0 || usage.users < config.maxUsers;
      case 'storageGB':
        return config.maxStorageGB < 0 || usage.storageGB < config.maxStorageGB;
      case 'advancedAnalytics':
        return config.id !== 'free';
      default:
        return true;
    }
  }

  getBillingSummary(): Observable<BillingSummary> {
    this.rateLimit.recordRequest();
    const plan = this.tenantContext.tenantPlan();
    const config = PLANS[plan];
    const usage = this._usage();
    const overages: { [key: string]: number } = {};
    let monthlyAmount = config.price;

    if (config.maxUsers >= 0 && usage.users > config.maxUsers) {
      overages['users'] = (usage.users - config.maxUsers) * 5;
      monthlyAmount += overages['users'];
    }
    if (config.maxStorageGB >= 0 && usage.storageGB > config.maxStorageGB) {
      overages['storage'] = (usage.storageGB - config.maxStorageGB) * 2;
      monthlyAmount += overages['storage'];
    }

    return of({
      plan,
      monthlyAmount,
      usage,
      overages,
    }).pipe(delay(300));
  }

  /** Simulates a subscription change: updates the tenant's plan, which re-gates features and limits. */
  changePlan(newPlan: SubscriptionPlan): Observable<boolean> {
    return of(true).pipe(
      delay(500),
      tap(() => this.tenantContext.setPlan(newPlan))
    );
  }

  private hash(s: string): number {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
      h = (h << 5) - h + s.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  }
}
