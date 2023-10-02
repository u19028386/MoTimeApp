import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RoleModel } from 'src/app/shared/role';
import { APIService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { AuditLog } from 'src/app/shared/auditLog';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.css']
})
export class EditRoleComponent implements OnInit{
    RoleForm = new FormGroup({
    userRoleName: new FormControl(''),
    userRoleDescription: new FormControl('')
  });

  role: RoleModel | undefined;
  userRoleId: number | undefined;

  constructor(
    private apiService: APIService,
    private router: Router,
    private toastr: NgToastService
  ) {}

  ngOnInit(): void {
    this.userRoleId = parseInt(localStorage.getItem('userRoleId')!, 10);
    if (isNaN(this.userRoleId)) {


    } else {
      this.loadUserRole();
    }
  }
  loadUserRole(): void {
    this.apiService.GetRole(this.userRoleId!).subscribe(result => {
      this.role = result;
      this.populateForm();
    });
  }

  populateForm(): void {
    if (this.role) {
      this.RoleForm.patchValue({
        userRoleName: this.role.userRoleName || '',
        userRoleDescription: this.role.userRoleDescription || ''
      });
    }
    const CurrentRole = localStorage.getItem('CurrentRole');
    if(CurrentRole != "Administrator")
    {
      this.router.navigate(['unauthorised']);
    }
  }

  cancel(): void {
    localStorage.removeItem('userRoleId');
    this.router.navigate(['/roles']);
  }

  onSubmit(): void {
    if (this.role && this.userRoleId) {
      const updatedRole: RoleModel = {
        userRoleId: this.userRoleId,
        userRoleName: this.RoleForm.value.userRoleName || '',
        userRoleDescription: this.RoleForm.value.userRoleDescription || ''
      };
      if (
        updatedRole.userRoleName === this.role.userRoleName &&
        updatedRole.userRoleDescription === this.role.userRoleDescription
      ) {
        this.toastr.error({ detail: 'Error', summary:'No changes made.' , duration: 5000 });
      }
      


      this.apiService.EditUserRole(updatedRole.userRoleId, updatedRole).subscribe(result => {
        const CurrentName = localStorage.getItem('CurrentName');
        const CurrentUser = localStorage.getItem('CurrentUser');
        if(CurrentName && CurrentUser != null)
        {
          const auditLog: AuditLog = {
            auditId: 0, // Set the appropriate value
            actor: CurrentName,
            actionPerformed: 'Edit a user role',
            entityType: 'User Role Entity',
            userId: +CurrentUser,
            auditTimeStamp: new Date(Date.now()),
            criticalData: 'Successful registration of a user '
          };
          this.apiService.logAudit(auditLog).subscribe(() => {
            console.log('Audit log for adding logging in created successfully.');
          });
        }
        this.toastr.success({ detail: 'SUCCESS', summary:'The role has been successfully updated' , duration: 5000 });
        localStorage.removeItem('userRoleId');
        this.router.navigate(['/roles']);
      });
    }
  }

}
