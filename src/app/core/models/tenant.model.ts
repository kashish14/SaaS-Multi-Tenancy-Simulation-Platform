/**
 * Tenant model — represents a tenant in the multi-tenant platform.
 * Tenants are fully isolated at the data and behavior level.
 */
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: SubscriptionPlan;
  createdAt: Date;
  status: 'active' | 'suspended' | 'trial';
  metadata?: Record<string, unknown>;
}

export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';
