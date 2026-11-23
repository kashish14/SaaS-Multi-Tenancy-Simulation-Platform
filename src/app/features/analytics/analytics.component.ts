import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, tap } from 'rxjs';
import { TenantContextService } from '../../core/services/tenant-context.service';
import { AnalyticsService, type AnalyticsSummary } from '../../core/services/analytics.service';
import { BillingService } from '../../core/services/billing.service';
import { AccessControlService } from '../../core/services/access-control.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
})
export class AnalyticsComponent {
  summary: AnalyticsSummary | null = null;
  loading = true;
  maxChartValue = 100;

  constructor(
    public readonly tenantContext: TenantContextService,
    private readonly analytics: AnalyticsService,
    private readonly billing: BillingService,
    private readonly access: AccessControlService
  ) {
    toObservable(this.tenantContext.currentTenant)
      .pipe(
        tap(() => (this.loading = true)),
        switchMap(() => this.analytics.getSummary()),
        takeUntilDestroyed()
      )
      .subscribe((s) => {
        this.summary = s;
        this.maxChartValue = Math.max(...s.chartData.map((d) => d.value), 1);
        this.loading = false;
      });
  }

  /** Plan gate: export is a Pro/Enterprise feature. */
  get planAllowsExport(): boolean {
    return this.billing.isFeatureAvailable('advancedAnalytics');
  }

  /** Role gate: only roles with analytics.export may download. */
  get roleAllowsExport(): boolean {
    return this.access.hasPermission('analytics.export');
  }

  barHeight(value: number): number {
    return Math.round((value / this.maxChartValue) * 100);
  }

  exportCsv(): void {
    if (!this.summary) return;
    const rows = [
      ['endpoint', 'calls', 'pct'],
      ...this.summary.apiByEndpoint.map((e) => [e.endpoint, e.calls, e.pct]),
      [],
      ['date', 'value'],
      ...this.summary.chartData.map((p) => [p.label, p.value]),
    ];
    const blob = new Blob([rows.map((r) => r.join(',')).join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${this.tenantContext.currentTenant()?.slug ?? 'tenant'}-analytics.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }
}
