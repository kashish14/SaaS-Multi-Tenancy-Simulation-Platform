import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TenantSwitcherComponent } from '../tenant-switcher/tenant-switcher.component';
import { AuthService } from '../../core/services/auth.service';
import { AccessControlService } from '../../core/services/access-control.service';
import { TenantContextService } from '../../core/services/tenant-context.service';
import { RateLimitService } from '../../core/services/rate-limit.service';
import { EventBusService } from '../../core/services/event-bus.service';
import type { UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TenantSwitcherComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly roles: UserRole[] = ['admin', 'manager', 'user'];

  constructor(
    public readonly auth: AuthService,
    public readonly tenantContext: TenantContextService,
    public readonly rateLimit: RateLimitService,
    private readonly access: AccessControlService,
    private readonly eventBus: EventBusService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  switchRole(role: string): void {
    this.auth.switchRole(role as UserRole);
    // Re-check the current route's role requirement; leave pages the new role can't see.
    let r = this.route.snapshot;
    while (r.firstChild) r = r.firstChild;
    const required = (r.data['roles'] as string[] | undefined) ?? [];
    if (required.length && !this.access.canAccessRoute(required)) {
      this.router.navigate(['/dashboard']);
    }
  }

  logout(): void {
    this.auth.logout();
    this.eventBus.emitLogout();
    this.router.navigate(['/login']);
  }
}
