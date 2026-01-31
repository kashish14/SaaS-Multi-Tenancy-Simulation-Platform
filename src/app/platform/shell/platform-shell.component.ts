import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TenantSwitcherComponent } from '../tenant-switcher/tenant-switcher.component';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-platform-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    TenantSwitcherComponent,
    HeaderComponent,
    SidebarComponent,
  ],
  templateUrl: './platform-shell.component.html',
  styleUrl: './platform-shell.component.scss',
})
export class PlatformShellComponent {}
