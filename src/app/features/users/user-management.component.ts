import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantContextService } from '../../core/services/tenant-context.service';
import { AccessControlService } from '../../core/services/access-control.service';
import { UserService } from '../../core/services/user.service';
import type { User } from '../../core/models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  loading = true;
  canEdit = false;
  canDelete = false;

  constructor(
    public readonly tenantContext: TenantContextService,
    private readonly access: AccessControlService,
    private readonly userService: UserService
  ) {
    this.canEdit = this.access.hasPermission('users.edit');
    this.canDelete = this.access.hasPermission('users.delete');
  }

  ngOnInit(): void {
    this.userService.getUsersByTenant(this.tenantContext.getTenantId()!).subscribe({
      next: (u) => {
        this.users = u;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
