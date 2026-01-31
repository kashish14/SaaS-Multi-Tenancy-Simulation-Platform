import { Injectable } from '@angular/core';
import { TenantContextService } from './tenant-context.service';

export interface RateLimitConfig {
  requestsPerMinute: number;
  requestsUsed: number;
  resetAt: Date;
}

/**
 * RateLimitService — Simulates tenant-based rate limiting.
 * Different plans get different limits.
 */
@Injectable({ providedIn: 'root' })
export class RateLimitService {
  private readonly limits: Record<string, number> = {
    free: 60,
    pro: 300,
    enterprise: 2000,
  };

  private readonly counters = new Map<string, { used: number; resetAt: number }>();

  constructor(private readonly tenantContext: TenantContextService) {}

  getConfig(): RateLimitConfig {
    const tenantId = this.tenantContext.getTenantId();
    const plan = this.tenantContext.tenantPlan();
    const limit = this.limits[plan] ?? 60;
    const key = tenantId ?? 'anon';
    let state = this.counters.get(key);
    const now = Date.now();

    if (!state || now >= state.resetAt) {
      state = { used: 0, resetAt: now + 60_000 };
      this.counters.set(key, state);
    }

    return {
      requestsPerMinute: limit,
      requestsUsed: state.used,
      resetAt: new Date(state.resetAt),
    };
  }

  canMakeRequest(): boolean {
    const config = this.getConfig();
    return config.requestsUsed < config.requestsPerMinute;
  }

  recordRequest(): void {
    const tenantId = this.tenantContext.getTenantId();
    const key = tenantId ?? 'anon';
    const state = this.counters.get(key);
    if (state) state.used++;
  }
}
