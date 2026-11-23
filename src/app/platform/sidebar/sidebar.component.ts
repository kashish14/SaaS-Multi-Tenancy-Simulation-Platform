import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccessControlService } from '../../core/services/access-control.service';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  permission?: string;
  roles?: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: '◉', roles: ['admin', 'manager', 'user'] },
    { path: '/users', label: 'Users', icon: '◇', roles: ['admin', 'manager'] },
    { path: '/analytics', label: 'Analytics', icon: '▷', roles: ['admin', 'manager', 'user'] },
    { path: '/billing', label: 'Billing', icon: '◈', roles: ['admin', 'manager', 'user'] },
    { path: '/settings', label: 'Settings', icon: '⚙', roles: ['admin'] },
  ];

  constructor(private readonly access: AccessControlService) {}

  canShow(item: NavItem): boolean {
    if (!item.roles?.length) return true;
    return this.access.hasAnyRole(...item.roles);
  }
}
