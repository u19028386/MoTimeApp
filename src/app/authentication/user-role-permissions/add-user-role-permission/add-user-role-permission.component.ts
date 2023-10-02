import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { PermissionModel } from 'src/app/shared/permissions';
import { RoleModel } from 'src/app/shared/role';

@Component({
  selector: 'app-add-user-role-permission',
  templateUrl: './add-user-role-permission.component.html',
  styleUrls: ['./add-user-role-permission.component.css']
})
export class AddUserRolePermissionComponent implements OnInit{
  permissions: PermissionModel[] = [];
  userRoles: RoleModel[] = [];
  selectedUserRole: number = 0;
  selectedPermissions: number[] = [];

  constructor(private apiService: APIService) { }

  ngOnInit() {
    this.apiService.getPermissions().subscribe(
      permissions => {
        this.permissions = permissions;
      },
      error => console.error('Error fetching permissions:', error)
    );

    this.apiService.getUserRoles().subscribe(
      userRoles => this.userRoles = userRoles,
      error => console.error('Error fetching user roles:', error)
    );
  }

  togglePermissionSelection(permissionId: number) {
    const index = this.selectedPermissions.indexOf(permissionId);
    if (index === -1) {
      this.selectedPermissions.push(permissionId);
    } else {
      this.selectedPermissions.splice(index, 1);
    }
  }

  addPermissions() {
    if (!this.selectedUserRole) {
      console.error('Please select a user role.');
      return;
    }

    // Now add user role permissions
    this.apiService.addUserRolePermission(this.selectedUserRole, this.selectedPermissions)
      .subscribe(
        () => {
          console.log('Permissions added successfully.');
        },
        error => {
          console.error('Error adding permissions:', error);
        }
      );
  }
}
