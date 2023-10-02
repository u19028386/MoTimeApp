import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { APIService } from 'src/app/services/api.service';
import { AuditLog } from 'src/app/shared/auditLog';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit{
  userId: number = 0;
  newPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  user: any = {};
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  public isValidEmail!: boolean;
  public hasLowerCase!: boolean;
  public hasUpperCase!: boolean;
  public isNumeric!: boolean;
  public hasSpecialCharacter!: boolean;
  public isGreaterThanEight!: boolean;

  constructor(private apiService: APIService, 
    private route: ActivatedRoute,
    private router: Router,
    private toastr: NgToastService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log('Route Params:', params); // Log the entire params object
      this.userId = +params['id']; // Convert the id parameter to a number
      console.log('Parsed userId:', this.userId);
    });
  }
  updatePassword() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.newPassword) {
      this.errorMessage = 'Please enter a new password.';
      return;
    }

    // Call the API to update the password
    this.apiService.updatePassword(this.userId, this.newPassword).subscribe(
      (res) => {
            const CurrentName = localStorage.getItem('CurrentName');
            const CurrentUser = localStorage.getItem('CurrentUser');
            if(CurrentName && CurrentUser != null)
            {
              const auditLog: AuditLog = {
                auditId: 0, // Set the appropriate value
                actor: CurrentName,
                actionPerformed: 'Update Password',
                entityType: 'Password',
                userId: +CurrentUser,
                auditTimeStamp: new Date(Date.now()),
                criticalData: 'Successful update of the password'
              };
              this.apiService.logAudit(auditLog).subscribe(() => {
                console.log('Audit log for adding logging in created successfully.');
              });
            }
        this.successMessage = 'Password updated successfully.';
        this.toastr.success({
          detail: "SUCCESS!",
          summary: "Password successfully updated!",
          duration: 3000
        });
        this.router.navigate(['profile', this.userId]);
      },
      error => {
        const CurrentName = localStorage.getItem('CurrentName');
        const CurrentUser = localStorage.getItem('CurrentUser');
        if(CurrentName && CurrentUser != null)
        {
          const auditLog: AuditLog = {
            auditId: 0, // Set the appropriate value
            actor: CurrentName,
            actionPerformed: 'Update Password',
            entityType: 'Password',
            userId: +CurrentUser,
            auditTimeStamp: new Date(Date.now()),
            criticalData: 'Unsuccessful update of the password'
          };
          this.apiService.logAudit(auditLog).subscribe(() => {
            console.log('Audit log for adding logging in created successfully.');
          });
        }
        this.errorMessage = 'An error occurred while updating the password.';
        console.error(error);
        this.toastr.error({
          detail: "ERROR!",
          summary: "Couldn't update your password. Please try again",
          duration: 3000
        });
      }
    );
  }
  hideShowPassword()
  {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }
  checkValidEmail(event: string)
  {
    const value = event;
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }
  checkLowerCase(event: string)
  {
    const value = event;
    const pattern = /[a-z]/;
    this.hasLowerCase = pattern.test(value);
    return this.hasLowerCase;
  }
  checkUpperCase(event: string)
  {
    const value = event;
    const pattern = /[A-Z]/;
    this.hasUpperCase = pattern.test(value);
    return this.hasUpperCase;
  }
  checkNumeric(event: string)
  {
    const value = event;
    const pattern = /[0-9]/;
    this.isNumeric = pattern.test(value);
    return this.isNumeric;
  }
  checkSpecialCharacter(event: string)
  {
    const value = event;
    const pattern = /[<>?{}[\]@#$%^&*()_':\/\/|\\=!\-";/\\]/;
    this.hasSpecialCharacter = pattern.test(value);
    return this.hasSpecialCharacter;
  }
  checkPasswordLength(event: string): boolean {
    const value = event;
    this.isGreaterThanEight = event.length > 8;
    return this.isGreaterThanEight;
  }
  onPasswordChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.checkLowerCase(value);
    this.checkUpperCase(value);
    this.checkNumeric(value);
    this.checkSpecialCharacter(value);
    this.checkPasswordLength(value);
  }

  cancel()
  {
    this.router.navigate(['profile', this.userId]);
  }
}
