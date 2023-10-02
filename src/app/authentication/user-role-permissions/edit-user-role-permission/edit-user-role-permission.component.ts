import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { PermissionModel } from 'src/app/shared/permissions';
import { RoleModel } from 'src/app/shared/role';
import { UserRolePermissionModel } from 'src/app/shared/rolePermission';

@Component({
  selector: 'app-edit-user-role-permission',
  templateUrl: './edit-user-role-permission.component.html',
  styleUrls: ['./edit-user-role-permission.component.css']
})
export class EditUserRolePermissionComponent implements OnInit{
  userRoles: RoleModel[] = [];
  selectedUserRole: number = 0;
  userRolePermissions: UserRolePermissionModel[] = [];
  permissions: PermissionModel[] = [];
  selectedPermissions: number[] = [];

  constructor(private apiService: APIService) { }

  ngOnInit() {
    this.apiService.getUserRoles().subscribe(
      userRoles => this.userRoles = userRoles,
      error => console.error('Error fetching user roles:', error)
    );
  }

  onUserRoleChange() {
    if (this.selectedUserRole) {
      this.apiService.getUserRolePermission(this.selectedUserRole).subscribe(
        (roles: UserRolePermissionModel[] | UserRolePermissionModel) => {
          if (Array.isArray(roles)) {
            this.userRolePermissions = roles;
            this.selectedPermissions = this.userRolePermissions.map(urp => urp.permissionId);
          } else {
            // Handle single object (convert to array)
            this.userRolePermissions = [roles];
            this.selectedPermissions = [roles.permissionId];
          }
        },
        error => console.error('Error fetching user role permissions:', error)
      );
    } else {
      this.userRolePermissions = [];
      this.selectedPermissions = [];
    }
  
    this.apiService.getPermissions().subscribe(
      permissions => this.permissions = permissions,
      error => console.error('Error fetching permissions:', error)
    );
  }
  

  togglePermissionSelection(permissionId: number) {
    if (this.selectedPermissions.includes(permissionId)) {
      this.selectedPermissions = this.selectedPermissions.filter(id => id !== permissionId);
    } else {
      this.selectedPermissions.push(permissionId);
    }
  }

  updatePermissions() {
    this.apiService.updateUserRolePermission(this.selectedUserRole, this.selectedPermissions)
      .subscribe(
        () => {
          console.log('Permissions updated successfully.');
        },
        error => {
          console.error('Error updating permissions:', error);
        }
      );
  }

}
