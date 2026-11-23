import { Component } from '@angular/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TenantContextService } from '../../core/services/tenant-context.service';
import { AnalyticsService, type AnalyticsSummary } from '../../core/services/analytics.service';
import { BillingService } from '../../core/services/billing.service';
import { ProjectService } from '../../core/services/project.service';
import { ActivityService } from '../../core/services/activity.service';
import type { MockProject } from '../../data/mock-data';
import type { MockActivity } from '../../data/mock-data';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  summary: AnalyticsSummary | null = null;
  projects: MockProject[] = [];
  activity: MockActivity[] = [];
  loading = true;

  constructor(
    public readonly tenantContext: TenantContextService,
    private readonly analytics: AnalyticsService,
    private readonly projectService: ProjectService,
    private readonly activityService: ActivityService,
    public readonly billing: BillingService
  ) {
    // Reload every time the active tenant changes (switcher or plan change).
    toObservable(this.tenantContext.currentTenant)
      .pipe(
        tap(() => (this.loading = true)),
        switchMap(() =>
          forkJoin({
            summary: this.analytics.getSummary(),
            projects: this.projectService.getProjectsByTenant(),
            activity: this.activityService.getRecentActivity(6),
          })
        ),
        takeUntilDestroyed()
      )
      .subscribe(({ summary, projects, activity }) => {
        this.summary = summary;
        this.projects = projects;
        this.activity = activity;
        this.maxChartValue = Math.max(...summary.chartData.map((d) => d.value), 1);
        this.loading = false;
      });
  }

  maxChartValue = 100;

  barHeight(value: number): number {
    return Math.round((value / this.maxChartValue) * 100);
  }

  timeAgo(d: Date): string {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }
}
