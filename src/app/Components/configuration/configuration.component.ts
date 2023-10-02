import { Component, EventEmitter, Input, Output} from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { APIService } from 'src/app/services/api.service';
import { AuditLog } from 'src/app/shared/auditLog';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent {
  isShown: boolean = false;
  customTimer: number = 0;
  timer: any;


  constructor(
    private toastr: NgToastService,
    private router: Router,
    private apiService: APIService
  ) {}


  ngOnInit() {
    this.startToastInterval();
    const CurrentRole = localStorage.getItem('CurrentRole');
    if(CurrentRole != "Administrator")
    {
      this.router.navigate(['unauthorised']);
    }
  }


  // startToastInterval() {
  //   // Clear any existing timer
  //   if (this.timer) {
  //     clearInterval(this.timer);
  //   }


  //   if (this.customTimer <= 0) {
  //     this.toastr.error({ detail: 'Error Message', summary: 'Entered time cannot be negative or equal to 0.', duration: 5000 });
  //     return; // Stop execution if negative
  //   }
  //   // Calculate the delay in milliseconds based on customHours (converted to hours)
  //   const delay = this.customTimer * 60 * 60 * 1000;


  //   // Set an interval to show the toast message with the specified delay
  //   this.timer = setInterval(() => {
  //     this.toastr.info({ detail: 'Reminder', summary: 'Please capture your time.', duration: 5000 });
  //   }, delay);
  // }




  // use this for testing in seconds for exam
  startToastInterval() {
    // Clear any existing timer
    if (this.timer) {
      clearInterval(this.timer);
    }


  if (this.customTimer <= 0) {
    this.toastr.error({ detail: 'Error Message', summary: 'Entered time cannot be negative or equal to 0.', duration: 5000 });
    return; // Stop execution if negative
  }


    // Set an interval to show the toast message with the specified delay
    this.timer = setInterval(() => {
      this.toastr.info({ detail: 'Reminder', summary: 'Please capture your time.', duration: 1000 });
    }, this.customTimer * 1000); // Convert customTimer to milliseconds
  }


  updateTimer() {
    const CurrentName = localStorage.getItem('CurrentName');
            const CurrentUser = localStorage.getItem('CurrentUser');
            if(CurrentName && CurrentUser != null)
            {
              const auditLog: AuditLog = {
                auditId: 0, // Set the appropriate value
                actor: CurrentName,
                actionPerformed: 'Set the timer',
                entityType: 'Alert',
                userId: +CurrentUser,
                auditTimeStamp: new Date(Date.now()),
                criticalData: 'Successful reset of the configuration timer'
              };
              this.apiService.logAudit(auditLog).subscribe(() => {
                console.log('Audit log for adding logging in created successfully.');
              });
            }
    this.startToastInterval(); // Restart the interval with the new customTimer value
    this.toastr.success({ detail: 'Success Message', summary: 'Timer updated successfully.', duration: 1000 });
  }


}
