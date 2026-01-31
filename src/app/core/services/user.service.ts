import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import type { User } from '../models/user.model';
import { MOCK_USERS } from '../../data/mock-data';

/**
 * UserService — Tenant-scoped user data.
 * Only returns users belonging to the specified tenant.
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  getUsersByTenant(tenantId: string): Observable<User[]> {
    const users = MOCK_USERS.filter((u) => u.tenantId === tenantId);
    return of(users).pipe(delay(300));
  }
}
