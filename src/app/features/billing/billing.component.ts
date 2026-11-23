import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, tap } from 'rxjs';
import { TenantContextService } from '../../core/services/tenant-context.service';
import { AccessControlService } from '../../core/services/access-control.service';
import { BillingService, type BillingSummary, type SubscriptionPlanConfig } from '../../core/services/billing.service';
import type { SubscriptionPlan } from '../../core/models/tenant.model';

const PLAN_ORDER: SubscriptionPlan[] = ['free', 'pro', 'enterprise'];

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.scss',
})
export class BillingComponent {
  summary: BillingSummary | null = null;
  plans: SubscriptionPlanConfig[];
  loading = true;
  changing: SubscriptionPlan | null = null;
  message = '';

  constructor(
    public readonly tenantContext: TenantContextService,
    public readonly billing: BillingService,
    private readonly access: AccessControlService
  ) {
    this.plans = PLAN_ORDER.map((p) => this.billing.plans[p]);
    // Plan changes update the tenant, which re-emits here and recalculates the bill.
    toObservable(this.tenantContext.currentTenant)
      .pipe(
        tap(() => (this.loading = !this.summary)),
        switchMap(() => this.billing.getBillingSummary()),
        takeUntilDestroyed()
      )
      .subscribe((s) => {
        this.summary = s;
        this.loading = false;
      });
  }

  get canManage(): boolean {
    return this.access.hasPermission('billing.manage');
  }

  hasOverages(s: BillingSummary): boolean {
    return Object.keys(s.overages).length > 0;
  }

  isUpgrade(plan: SubscriptionPlan): boolean {
    return PLAN_ORDER.indexOf(plan) > PLAN_ORDER.indexOf(this.tenantContext.tenantPlan());
  }

  changePlan(plan: SubscriptionPlan): void {
    this.changing = plan;
    this.message = '';
    this.billing.changePlan(plan).subscribe(() => {
      this.changing = null;
      this.message = `${this.tenantContext.tenantName()} is now on the ${this.billing.plans[plan].name} plan.`;
    });
  }
}
