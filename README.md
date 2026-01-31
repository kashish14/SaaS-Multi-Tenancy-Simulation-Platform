# TenantSphere — SaaS Multi-Tenancy Simulation Platform

> A locally runnable web application demonstrating **platform-level multi-tenancy** — tenant isolation, RBAC, subscription billing, and scaling logic as found in enterprise SaaS systems.

---

## What Is TenantSphere?

TenantSphere is **not** a simple SaaS CRUD app. It is a **platform simulation** that shows how multi-tenant systems are architecturally designed: how a shared system serves multiple tenants, isolates data and behavior per tenant, enforces role-based permissions, scales features by subscription tier, and simulates billing and usage metering.

**Target audience:** Engineers, architects, and product owners who want to understand or communicate multi-tenant platform patterns.

---

## How to Run Locally

```bash
npm install
npm start
```

Then open [http://localhost:4200](http://localhost:4200).

**Login:** Use the simulated login screen to pick a tenant and user (with a specific role). Each combination demonstrates different isolation and permission behavior.

---

## Multi-Tenancy Implementation

### Tenant Isolation Strategy

- **Tenant Context Service** (`TenantContextService`) is the single source of truth for the active tenant.
- All tenant-aware data access flows through this service. Data keys are prefixed with `tenant:{tenantId}:` so storage never crosses tenant boundaries.
- **Tenant-Storage Service** (`TenantStorageService`) wraps `localStorage` with tenant-scoped keys. Switching tenants immediately changes which data is read/written.
- Mock services (analytics, billing, user) filter data by `tenantId`. In production, this would map to row-level security or sharded databases.

### Data Isolation in Code

```typescript
// TenantStorageService — every key is tenant-scoped
getTenantStorageKey(prefix: string): string {
  const id = this.getTenantId();
  return id ? `tenant:${id}:${prefix}` : prefix;
}
```

### Tenant Switching

The header includes a **Tenant Switcher**. Changing tenants:

1. Updates the active tenant in `TenantContextService`
2. Refreshes all tenant-scoped data
3. Emits `tenant_switched` on the event bus for cross-module coordination
4. Keeps the same logged-in user (simulating a user with access to multiple tenants)

---

## Role-Based Access Control (RBAC)

### Roles and Permissions

| Role    | Permissions |
|--------|-------------|
| **Admin**  | Full access: users (CRUD), analytics export, billing manage, platform settings |
| **Manager**| Users (view/create/edit), analytics export, billing view |
| **User**   | Dashboard, analytics view, billing view |

### Enforcement

- **Route guards** (`AuthGuard`, `RoleGuard`): Protect routes by authentication and required roles.
- **AccessControlService**: Central permission checks via `hasPermission(permission)` and `canAccessRoute(roles)`.
- **UI**: Sidebar and feature components hide or disable actions based on `AccessControlService`.

### Permission Matrix

Defined in `permission.model.ts`:

```typescript
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: ['dashboard.view', 'users.view', 'users.create', 'users.edit', 'users.delete', ...],
  manager: ['dashboard.view', 'users.view', 'users.create', 'users.edit', ...],
  user: ['dashboard.view', 'analytics.view', 'billing.view'],
};
```

---

## Billing & Subscription Simulation

### Plans

| Plan       | Price  | Users | Storage | Features |
|-----------|--------|-------|---------|----------|
| Free      | $0     | 3     | 1 GB    | Basic dashboard |
| Pro       | $49/mo | 25    | 50 GB   | Advanced analytics, export |
| Enterprise| $299/mo| ∞     | ∞       | SLA, dedicated support |

### Billing Logic

- **Usage metrics** (users, storage, API calls) are simulated per tenant.
- **Overages**: Free and Pro charge $5/user and $2/GB over plan limits.
- **Feature gating**: `BillingService.isFeatureAvailable('advancedAnalytics')` returns `false` for Free; Pro and Enterprise get export and advanced analytics.
- **Upgrade flow**: Simulated; in production this would integrate with Stripe, Chargebee, etc.

---

## Scalability Considerations

### Rate Limiting (Simulated)

- **RateLimitService** applies different limits per plan:
  - Free: 60 req/min
  - Pro: 300 req/min
  - Enterprise: 2000 req/min
- Limits are keyed by tenant ID. The header displays current usage.

### Feature Throttling

- Analytics export is gated by plan.
- Usage and billing dashboards reflect plan-specific limits.

### Platform Trade-Offs

| Approach | Pros | Cons |
|----------|------|------|
| Shared DB, tenant_id column | Simple, low cost | Requires strict RLS and auditing |
| Schema-per-tenant | Strong isolation | Harder migrations, more ops |
| DB-per-tenant | Maximum isolation | Higher cost, complex backups |
| TenantSphere (simulated) | Demonstrates patterns | In-memory/mock; not production DB |

TenantSphere uses a **shared in-memory / localStorage** model with tenant-scoped keys and filtering. This mirrors the "shared DB with tenant_id" pattern at the application layer.

---

## Architecture Overview

```
src/app/
├── core/                 # Platform-level concerns
│   ├── guards/           # Auth + Role guards
│   ├── models/           # Tenant, User, Permission
│   ├── services/         # TenantContext, Auth, AccessControl, Billing, etc.
│   └── error-handler/    # Global error handling
├── platform/             # Shell & navigation
│   ├── shell/
│   ├── header/
│   ├── sidebar/
│   └── tenant-switcher/
├── features/             # Domain modules
│   ├── auth/login/
│   ├── dashboard/
│   ├── users/
│   ├── analytics/
│   ├── billing/
│   └── settings/
├── shared/               # Reusable directives, pipes
└── data/                 # Mock data
```

---

## Tech Stack

- **Angular 18** (standalone components)
- **TypeScript 5.4**
- **RxJS**
- **SCSS**
- **Mock backend** (in-memory, localStorage)
- **No external chart lib** (custom CSS charts for demo)

---

## Testing

```bash
npm test
```

Tests cover:

- **Tenant isolation**: Storage keys, tenant switching, no cross-tenant leakage
- **RBAC**: Permission checks per role, route access
- **Billing**: Plan configs, feature gating, summary generation

---

## Production Readiness Notes

This is a **simulation platform**, not a production deployment. For real systems, consider:

- Real authentication (OAuth2, OIDC)
- Secure backend APIs with tenant-scoped queries
- Database RLS or application-level tenant filtering
- Proper billing integration (Stripe, etc.)
- Monitoring, APM, and structured logging
- Rate limiting at API gateway or reverse proxy

---

## License

MIT
