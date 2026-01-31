import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantContextService } from '../../core/services/tenant-context.service';
import { AnalyticsService, type AnalyticsSummary } from '../../core/services/analytics.service';
import { BillingService } from '../../core/services/billing.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
})
export class AnalyticsComponent implements OnInit {
  summary: AnalyticsSummary | null = null;
  loading = true;
  canExport = false;
  maxChartValue = 100;

  constructor(
    public readonly tenantContext: TenantContextService,
    private readonly analytics: AnalyticsService,
    private readonly billing: BillingService
  ) {
    this.canExport = this.billing.isFeatureAvailable('advancedAnalytics');
  }

  ngOnInit(): void {
    this.analytics.getSummary().subscribe({
      next: (s) => {
        this.summary = s;
        this.maxChartValue = Math.max(...s.chartData.map((d) => d.value), 1);
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  barHeight(value: number): number {
    return Math.round((value / this.maxChartValue) * 100);
  }
}
