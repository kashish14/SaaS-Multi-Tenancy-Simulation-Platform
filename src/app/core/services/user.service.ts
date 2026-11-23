import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import type { User } from '../models/user.model';
import { MOCK_USERS } from '../../data/mock-data';
import { TenantContextService } from './tenant-context.service';
import { TenantStorageService } from './tenant-storage.service';
import { RateLimitService } from './rate-limit.service';

const USERS_KEY = 'users';

/**
 * UserService — Tenant-scoped user data.
 * Seeded from mock data; edits are persisted under the active tenant's storage namespace,
 * so changes in one tenant are never visible from another.
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private readonly tenantContext: TenantContextService,
    private readonly tenantStorage: TenantStorageService,
    private readonly rateLimit: RateLimitService
  ) {}

  getUsersByTenant(): Observable<User[]> {
    this.rateLimit.recordRequest();
    return of(this.current()).pipe(delay(300));
  }

  updateUser(user: User): User[] {
    return this.save(this.current().map((u) => (u.id === user.id ? user : u)));
  }

  deleteUser(id: string): User[] {
    return this.save(this.current().filter((u) => u.id !== id));
  }

  private current(): User[] {
    const tenantId = this.tenantContext.getTenantId();
    return (
      this.tenantStorage.getItem<User[]>(USERS_KEY) ??
      MOCK_USERS.filter((u) => u.tenantId === tenantId)
    );
  }

  private save(users: User[]): User[] {
    this.tenantStorage.setItem(USERS_KEY, users);
    return users;
  }
}
