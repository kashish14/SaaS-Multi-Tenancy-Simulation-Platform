import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { TenantContextService } from './tenant-context.service';
import { RateLimitService } from './rate-limit.service';

export interface MetricPoint {
  label: string;
  value: number;
  timestamp?: string;
}

export interface ApiEndpointUsage {
  endpoint: string;
  calls: number;
  pct: number;
}

export interface AnalyticsSummary {
  activeUsers: number;
  apiCalls: number;
  storageUsed: number;
  trend: 'up' | 'down' | 'stable';
  chartData: MetricPoint[];
  apiByEndpoint: ApiEndpointUsage[];
}

/**
 * AnalyticsService — Tenant-scoped usage analytics.
 * All metrics are isolated per tenant.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  constructor(
    private readonly tenantContext: TenantContextService,
    private readonly rateLimit: RateLimitService
  ) {}

  getSummary(): Observable<AnalyticsSummary> {
    this.rateLimit.recordRequest();
    const tenantId = this.tenantContext.getTenantId();
    const seed = tenantId ? this.hash(tenantId) : 0;

    const chartData: MetricPoint[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      chartData.push({
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: 30 + (seed % 70) + (i * 2) + ((seed + i) % 15),
        timestamp: d.toISOString(),
      });
    }

    const endpoints = [
      { endpoint: '/api/users', base: 25 },
      { endpoint: '/api/projects', base: 40 },
      { endpoint: '/api/analytics', base: 15 },
      { endpoint: '/api/billing', base: 8 },
      { endpoint: '/api/webhooks', base: 12 },
    ];
    const totalCalls = 5000 + (seed % 20000);
    const apiByEndpoint: ApiEndpointUsage[] = endpoints.map((e, i) => {
      const calls = Math.round((e.base + (seed % 10) + i * 3) * (totalCalls / 500));
      return { endpoint: e.endpoint, calls, pct: 0 };
    });
    const actualTotal = apiByEndpoint.reduce((s, e) => s + e.calls, 0);
    apiByEndpoint.forEach((e) => (e.pct = Math.round((e.calls / actualTotal) * 100)));

    const trend: 'up' | 'down' | 'stable' = seed % 3 === 0 ? 'up' : seed % 3 === 1 ? 'down' : 'stable';
    return of({
      activeUsers: 8 + (seed % 35),
      apiCalls: totalCalls,
      storageUsed: 1.2 + (seed % 80) / 20,
      trend,
      chartData,
      apiByEndpoint,
    }).pipe(delay(400));
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
