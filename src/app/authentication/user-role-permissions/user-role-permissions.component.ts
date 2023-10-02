import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/api.service';
import { PermissionModel } from 'src/app/shared/permissions';
import { RoleModel } from 'src/app/shared/role';

@Component({
  selector: 'app-user-role-permissions',
  templateUrl: './user-role-permissions.component.html',
  styleUrls: ['./user-role-permissions.component.css']
})
export class UserRolePermissionsComponent {
  roles: RoleModel[] = [];
  permissions: PermissionModel[] = []

  constructor(private apiService: APIService, private router: Router) { }

  ngOnInit() {
    this.apiService.getUserRoles().subscribe(
      roles => this.roles = roles,
      error => console.error('Error fetching roles:', error)
    );

    this.apiService.getPermissions().subscribe(
      permissions => this.permissions = permissions,
      error => console.error('Error fetching permissions:', error)
    );
  }

  editPermissions(roleId: number) {
    this.router.navigate(['/edit-permissions', roleId]);
  }

}
