import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TenantSwitcherComponent } from '../tenant-switcher/tenant-switcher.component';
import { AuthService } from '../../core/services/auth.service';
import { TenantContextService } from '../../core/services/tenant-context.service';
import { RateLimitService } from '../../core/services/rate-limit.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TenantSwitcherComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(
    public readonly auth: AuthService,
    public readonly tenantContext: TenantContextService,
    public readonly rateLimit: RateLimitService,
    private readonly router: Router
  ) {}

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
