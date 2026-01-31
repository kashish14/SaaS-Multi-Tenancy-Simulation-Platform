import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';
import { TenantContextService } from '../../core/services/tenant-context.service';
import { EventBusService } from '../../core/services/event-bus.service';
import type { Tenant } from '../../core/models/tenant.model';

@Component({
  selector: 'app-tenant-switcher',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective],
  templateUrl: './tenant-switcher.component.html',
  styleUrl: './tenant-switcher.component.scss',
})
export class TenantSwitcherComponent {
  isOpen = signal(false);
  availableTenants: Tenant[] = [];

  constructor(
    private readonly tenantContext: TenantContextService,
    private readonly eventBus: EventBusService
  ) {
    this.tenantContext.availableTenants$.subscribe((t) => (this.availableTenants = t));
  }

  get currentTenant() {
    return this.tenantContext.currentTenant();
  }

  toggle(): void {
    this.isOpen.update((v) => !v);
  }

  switchTo(tenant: Tenant): void {
    this.tenantContext.switchTenant(tenant.id);
    this.eventBus.emitTenantSwitched(tenant.id);
    this.isOpen.set(false);
  }
}
