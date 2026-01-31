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
  constructor(
    public readonly tenantContext: TenantContextService,
    private readonly tenantStorage: TenantStorageService
  ) {}

  clearTenantData(): void {
    if (confirm('Clear all tenant-scoped data? This cannot be undone.')) {
      this.tenantStorage.clear();
      alert('Tenant data cleared.');
    }
  }
}
