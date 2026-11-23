import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, tap } from 'rxjs';
import { TenantContextService } from '../../core/services/tenant-context.service';
import { AccessControlService } from '../../core/services/access-control.service';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import type { User, UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent {
  readonly roles: UserRole[] = ['admin', 'manager', 'user'];
  users: User[] = [];
  loading = true;
  editingId: string | null = null;
  editRole: UserRole = 'user';

  constructor(
    public readonly tenantContext: TenantContextService,
    private readonly access: AccessControlService,
    private readonly auth: AuthService,
    private readonly userService: UserService
  ) {
    toObservable(this.tenantContext.currentTenant)
      .pipe(
        tap(() => {
          this.loading = true;
          this.editingId = null;
        }),
        switchMap(() => this.userService.getUsersByTenant()),
        takeUntilDestroyed()
      )
      .subscribe((u) => {
        this.users = u;
        this.loading = false;
      });
  }

  get canEdit(): boolean {
    return this.access.hasPermission('users.edit');
  }

  get canDelete(): boolean {
    return this.access.hasPermission('users.delete');
  }

  isSelf(user: User): boolean {
    return user.id === this.auth.currentUser()?.id;
  }

  startEdit(user: User): void {
    this.editingId = user.id;
    this.editRole = user.role;
  }

  saveEdit(user: User): void {
    this.users = this.userService.updateUser({ ...user, role: this.editRole });
    this.editingId = null;
  }

  remove(user: User): void {
    this.users = this.userService.deleteUser(user.id);
  }
}
