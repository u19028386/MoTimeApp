import {ResetPassword} from 'src/app/shared/reset-password';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { ConfirmPasswordValidator } from 'src/app/Helpers/confirm-password.validator';
import { NgToastService } from 'ng-angular-popup';
import { APIService } from 'src/app/services/api.service';
import ValidateForm from '../Helpers/validateForm';
import { ResetPasswordService } from 'src/app/services/reset-password.service';
import { AuditLog } from 'src/app/shared/auditLog';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit{
  resetPasswordForm!: FormGroup;
  emailToReset!: string;
  emailToken!: string;
  resetPasswordObj = new ResetPassword();

  constructor(private fb: FormBuilder, 
    private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private toastr: NgToastService, 
    private apiService: ResetPasswordService,
    private apService: APIService){}

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    }, {
      validator: ConfirmPasswordValidator("password", "confirmPassword")
    });
    this.activatedRoute.queryParams.subscribe(val=>{
      this.emailToReset = val['email'];
      let uriToken = val['code'];
      this.emailToken = uriToken.replace(/ /g,'+');
      console.log(this.emailToken);
      console.log(this.emailToReset)
    })

  }

  Reset()
  {
    if(this.resetPasswordForm.valid)
    {
      this.resetPasswordObj.email = this.emailToReset;
      this.resetPasswordObj.newPassword = this.resetPasswordForm.value.password;
      this.resetPasswordObj.confirmPassword = this.resetPasswordForm.value.confirmPassword;
      this.resetPasswordObj.emailToken = this.emailToken;
      console.log(`Reset token being sent: ${this.resetPasswordObj.emailToken}`);
      this.apiService.resetPassword(this.resetPasswordObj)
      .subscribe({
        next:(res)=>{
            const CurrentName = localStorage.getItem('CurrentName');
            const CurrentUser = localStorage.getItem('CurrentUser');
            if(CurrentName && CurrentUser != null)
            {
              const auditLog: AuditLog = {
                auditId: 0, // Set the appropriate value
                actor: CurrentName,
                actionPerformed: 'Reset Password',
                entityType: 'Password',
                userId: +CurrentUser,
                auditTimeStamp: new Date(Date.now()),
                criticalData: 'Successful reset of the password'
              };
              this.apService.logAudit(auditLog).subscribe(() => {
                console.log('Audit log for adding logging in created successfully.');
              });
            }
          this.toastr.success({
            detail: "SUCCESS",
            summary: "Password Reset Successfully!",
            duration: 3000,
          });
          this.router.navigate(['login'])
        },
        error:(err)=>{
          const CurrentName = localStorage.getItem('CurrentName');
            const CurrentUser = localStorage.getItem('CurrentUser');
            if(CurrentName && CurrentUser != null)
            {
              const auditLog: AuditLog = {
                auditId: 0, // Set the appropriate value
                actor: CurrentName,
                actionPerformed: 'Reset Password',
                entityType: 'Password',
                userId: +CurrentUser,
                auditTimeStamp: new Date(Date.now()),
                criticalData: 'Unsuccessful reset of the password'
              };
              this.apService.logAudit(auditLog).subscribe(() => {
                console.log('Audit log for adding logging in created successfully.');
              });
            }
          this.toastr.error({
            detail: "ERROR",
            summary: "There was an error reseting the password. Please try again.",
            duration: 3000,
          })
        }
      })
    }
    else{
      ValidateForm.validateAllFormFields(this.resetPasswordForm);
    }
    
  }



}
