import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type TenantEvent = {
  type: 'tenant_switched' | 'tenant_updated';
  tenantId: string;
  payload?: unknown;
};

export type AuthEvent = {
  type: 'login' | 'logout';
  userId?: string;
};

export type PlatformEvent = TenantEvent | AuthEvent;

/**
 * EventBusService — RxJS-based event bus for platform-wide events.
 * Used for cross-module communication without tight coupling.
 */
@Injectable({ providedIn: 'root' })
export class EventBusService {
  private readonly _events = new Subject<PlatformEvent>();

  readonly events$ = this._events.asObservable();

  emit(event: PlatformEvent): void {
    this._events.next(event);
  }

  emitTenantSwitched(tenantId: string): void {
    this.emit({ type: 'tenant_switched', tenantId });
  }

  emitLogin(userId: string): void {
    this.emit({ type: 'login', userId });
  }

  emitLogout(): void {
    this.emit({ type: 'logout' });
  }
}
