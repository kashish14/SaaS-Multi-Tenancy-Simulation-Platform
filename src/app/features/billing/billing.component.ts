import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantContextService } from '../../core/services/tenant-context.service';
import { BillingService, type BillingSummary, type SubscriptionPlanConfig } from '../../core/services/billing.service';
import type { SubscriptionPlan } from '../../core/models/tenant.model';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss',
})
export class BillingComponent implements OnInit {
  readonly Object = Object;
  summary: BillingSummary | null = null;
  plans: SubscriptionPlanConfig[] = [];
  loading = true;
  upgrading = false;

  constructor(
    public readonly tenantContext: TenantContextService,
    public readonly billing: BillingService
  ) {
    this.plans = Object.values(this.billing.plans);
  }

  ngOnInit(): void {
    this.billing.getBillingSummary().subscribe({
      next: (s) => {
        this.summary = s;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  upgrade(plan: SubscriptionPlan): void {
    this.upgrading = true;
    this.billing.upgradePlan(plan).subscribe({
      next: () => {
        this.upgrading = false;
        alert(`Simulation: Upgrade to ${plan} requested. In production, this would update the tenant's subscription and trigger billing.`);
        this.ngOnInit();
      },
      error: () => (this.upgrading = false),
    });
  }
}
