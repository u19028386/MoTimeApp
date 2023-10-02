import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from 'src/app/services/api.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ProjectRequestViewModel } from 'src/app/shared/projectRequest';
import ValidateForm from 'src/app/authentication/Helpers/validateForm';
import { NgToastService } from 'ng-angular-popup';
import { ProjectRequestStatus } from 'src/app/shared/projectRequestStatus';
import { UserStoreService } from 'src/app/user-store.service';

@Component({
  selector: 'app-log-project-request',
  templateUrl: './log-project-request.component.html',
  styleUrls: ['./log-project-request.component.css']
})
export class LogProjectRequestComponent implements OnInit{
  requestForm = new FormGroup({
    employeeId: new FormControl('', Validators.required),
    projectRequestDescription: new FormControl('', [Validators.required]),
    projectRequestDate: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, 
    private apiService: APIService,
    private userStore: UserStoreService,
    private toast: NgToastService) {}

  ngOnInit(): void {
    const user = localStorage.getItem('CurrentUser');
   

  }
  
  onSubmit() {
    
    const description: string = this.requestForm.get('projectRequestDescription')?.value || '';
    const dateString: string = this.requestForm.get('projectRequestDate')?.value || '';
    const date: Date = dateString ? new Date(dateString) : new Date();
 
      const formData = new FormData();
      formData.append('projectRequestDescription', description.toString());
      formData.append('projectRequestDate', date.toISOString());
 
      this.apiService.logProjectRequest(formData).subscribe(
        () => {
          // Success: Display a success toast
          this.toast.success({
            detail: 'Success Message',
            summary: 'You have successfully submitted a project request',
            duration: 15000,
          });
 
          // Navigate back to '/claimCapture' on successful submission
          this.router.navigate(['/project-manager']);
        },
        (error) => {
          // Error: Display a failure toast
          this.toast.error({
            detail: 'Error Message',
            summary: 'Project request submission failed. Please try again.',
            duration: 15000,
          });
          console.error('Project request submission failed:', error);
        }
      );
  }
  cancel() {
    this.router.navigate(['/project-requests']);
  }
}
