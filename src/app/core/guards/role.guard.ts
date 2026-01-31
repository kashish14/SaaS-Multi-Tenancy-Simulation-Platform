import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AccessControlService } from '../services/access-control.service';

export const RoleGuard: CanActivateFn = (route, _state) => {
  const access = inject(AccessControlService);
  const router = inject(Router);
  const roles = (route.data['roles'] as string[]) ?? [];

  if (roles.length === 0) return true;
  if (access.canAccessRoute(roles)) return true;

  return router.createUrlTree(['/dashboard']);
};
