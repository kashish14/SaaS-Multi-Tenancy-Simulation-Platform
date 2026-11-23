import { TestBed } from '@angular/core/testing';
import { AccessControlService } from './access-control.service';
import { AuthService } from './auth.service';
import type { User } from '../models/user.model';

describe('AccessControlService', () => {
  let service: AccessControlService;
  let auth: AuthService;

  const loginAs = (role: User['role']) => {
    auth.login(
      {
        id: 'u1',
        email: 'test@test.com',
        name: 'Test',
        role,
        tenantId: 't1',
      },
      { id: 't1', name: 'T', slug: 't', plan: 'pro', status: 'active', createdAt: new Date() }
    );
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessControlService);
    auth = TestBed.inject(AuthService);
    auth.logout();
  });

  it('should deny permission when not authenticated', () => {
    expect(service.hasPermission('dashboard.view')).toBe(false);
  });

  it('should grant admin all permissions', () => {
    loginAs('admin');
    expect(service.hasPermission('dashboard.view')).toBe(true);
    expect(service.hasPermission('users.delete')).toBe(true);
    expect(service.hasPermission('settings.manage')).toBe(true);
  });

  it('should restrict user role', () => {
    loginAs('user');
    expect(service.hasPermission('dashboard.view')).toBe(true);
    expect(service.hasPermission('users.delete')).toBe(false);
    expect(service.hasPermission('settings.manage')).toBe(false);
  });

  it('should allow manager to edit users but not delete', () => {
    loginAs('manager');
    expect(service.hasPermission('users.edit')).toBe(true);
    expect(service.hasPermission('users.delete')).toBe(false);
  });

  it('should check route access by role', () => {
    loginAs('user');
    expect(service.canAccessRoute(['admin', 'manager'])).toBe(false);
    loginAs('manager');
    expect(service.canAccessRoute(['admin', 'manager'])).toBe(true);
  });

  it('should apply new permissions after a role switch', () => {
    loginAs('admin');
    auth.switchRole('user');
    expect(service.hasPermission('users.view')).toBe(false);
    expect(service.hasPermission('dashboard.view')).toBe(true);
  });
});
