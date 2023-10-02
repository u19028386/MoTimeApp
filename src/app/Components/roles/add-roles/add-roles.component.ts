import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/api.service';
import { RoleModel } from 'src/app/shared/role';
import ValidateForm from 'src/app/authentication/Helpers/validateForm';
import { NgToastService } from 'ng-angular-popup';
import { UserStoreService } from 'src/app/user-store.service';
import { AuditLog } from 'src/app/shared/auditLog';
import { User } from 'src/app/shared/user';

@Component({
  selector: 'app-add-roles',
  templateUrl: './add-roles.component.html',
  styleUrls: ['./add-roles.component.css']
})
export class AddRolesComponent implements OnInit{

  RoleForm: FormGroup;
  public userId!: string;
  public fullName: string = "";
  
  constructor( private router: Router,
    private apiService: APIService, 
    private formBuilder: FormBuilder, 
    private toastr: NgToastService,
    private userStore: UserStoreService){
    this.RoleForm = this.formBuilder.group({
      userRoleName: ['', Validators.required],
      userRoleDescription: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userStore.getUserId()
    .subscribe(val=>{
      const idFromToken = this.apiService.getUserIdFromToken();
      this.userId = (val || idFromToken) as string
    });
    this.userStore.getFullName()
  .subscribe(val => {
    const fullNameFromToken = this.apiService.getNameFromToken();
    this.fullName = (val || fullNameFromToken) as string;
});
const CurrentRole = localStorage.getItem('CurrentRole');
if(CurrentRole != "Administrator")
{
  this.router.navigate(['unauthorised']);
}
  }

  cancel(){
    this.router.navigate(['/roles'])
  }
  onSubmit() {
    if (this.RoleForm.valid) {
      const userRoleName: string = this.RoleForm.get('userRoleName')?.value || '';
      const userRoleDescription: string = this.RoleForm.get('userRoleDescription')?.value || '';

      const role: RoleModel = {
        userRoleId: 0, // Assuming you set the appropriate value on the server-side
        userRoleName: userRoleName,
        userRoleDescription: userRoleDescription
      };
      

      this.apiService.AddUserRole(role).subscribe(result => {
        // Log the action
        const auditLog: AuditLog = {
          auditId: 0, // Set the appropriate value
          actor: this.fullName,
          actionPerformed: 'Added User Role: ' + result.userRoleName,
          entityType: 'User Role Entity',
          userId: +this.userId,
          auditTimeStamp: new Date(Date.now()),
          criticalData: 'Successfully added the user role'
        };

          this.apiService.logAudit(auditLog).subscribe(() => {
            console.log('Audit log for adding user role in created successfully.');
          });
          this.toastr.success({ detail: 'SUCCESS', summary: 'Role has been successfully created!', duration: 5000 });

        this.router.navigate(['/roles']);
      });
  }
    else {
      const auditLog: AuditLog = {
        auditId: 0, // Set the appropriate value
        actor: this.fullName,
        actionPerformed: 'Added User Role: ',
        entityType: 'User Role Entity',
        userId: +this.userId,
        auditTimeStamp: new Date(Date.now()),
        criticalData: 'Error adding the role'
      };

        this.apiService.logAudit(auditLog).subscribe(() => {
          console.log('Audit log for adding user role unsuccessful.');
        });
      ValidateForm.validateAllFormFields(this.RoleForm);
      this.toastr.error({ detail: 'ERROR', summary: 'Please make sure all fields are entered!', duration: 5000 });
    }
  }
}
