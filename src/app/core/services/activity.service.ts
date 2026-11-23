import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { TenantContextService } from './tenant-context.service';
import { RateLimitService } from './rate-limit.service';
import { MOCK_ACTIVITY, type MockActivity } from '../../data/mock-data';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  constructor(
    private readonly tenantContext: TenantContextService,
    private readonly rateLimit: RateLimitService
  ) {}

  getRecentActivity(limit = 5): Observable<MockActivity[]> {
    this.rateLimit.recordRequest();
    const tenantId = this.tenantContext.getTenantId();
    const activities = tenantId
      ? MOCK_ACTIVITY.filter((a) => a.tenantId === tenantId)
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, limit)
      : [];
    return of(activities).pipe(delay(150));
  }
}
