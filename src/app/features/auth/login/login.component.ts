import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import { EventBusService } from '../../../core/services/event-bus.service';
import { MOCK_USERS } from '../../../data/mock-data';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  selectedTenantId = '';
  selectedUserId = '';
  tenants;
  usersByTenant: Record<string, typeof MOCK_USERS> = {};

  constructor(
    private readonly auth: AuthService,
    private readonly tenantContext: TenantContextService,
    private readonly eventBus: EventBusService,
    private readonly router: Router
  ) {
    this.tenants = this.tenantContext.availableTenants();
    for (const t of this.tenants) {
      this.usersByTenant[t.id] = MOCK_USERS.filter((u) => u.tenantId === t.id);
    }
    if (this.tenants.length > 0) {
      this.selectedTenantId = this.tenants[0].id;
      this.onTenantChange(this.selectedTenantId);
    }
  }

  get users(): typeof MOCK_USERS {
    return this.usersByTenant[this.selectedTenantId] ?? [];
  }

  onTenantChange(tenantId: string): void {
    const u = this.usersByTenant[tenantId];
    this.selectedUserId = u?.length ? u[0].id : '';
  }

  login(): void {
    const tenant = this.tenants.find((t) => t.id === this.selectedTenantId);
    const user = this.users.find((u) => u.id === this.selectedUserId);
    if (!tenant || !user) return;

    this.auth.login({ ...user, tenant }, tenant);
    this.eventBus.emitLogin(user.id);
    this.router.navigate(['/dashboard']);
  }
}
