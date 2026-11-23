import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantContextService } from '../../core/services/tenant-context.service';
import { TenantStorageService } from '../../core/services/tenant-storage.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  message = '';

  constructor(
    public readonly tenantContext: TenantContextService,
    private readonly tenantStorage: TenantStorageService
  ) {}

  get storedKeys(): string[] {
    return this.tenantStorage.keys();
  }

  clearTenantData(): void {
    if (!confirm(`Clear all stored data for ${this.tenantContext.tenantName()}? Seed data will be restored.`)) return;
    this.tenantStorage.clear();
    this.message = 'Tenant-scoped data cleared. Other tenants were not affected.';
  }
}
