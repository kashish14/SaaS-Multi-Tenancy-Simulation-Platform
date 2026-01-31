import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { TenantContextService } from './tenant-context.service';
import { MOCK_PROJECTS, type MockProject } from '../../data/mock-data';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  constructor(private readonly tenantContext: TenantContextService) {}

  getProjectsByTenant(): Observable<MockProject[]> {
    const tenantId = this.tenantContext.getTenantId();
    const projects = tenantId
      ? MOCK_PROJECTS.filter((p) => p.tenantId === tenantId)
      : [];
    return of(projects).pipe(delay(200));
  }
}
