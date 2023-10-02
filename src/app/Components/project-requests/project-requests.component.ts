import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';
import { APIService } from 'src/app/services/api.service';
import { ProjectRequestViewModel } from 'src/app/shared/projectRequest';
import { ProjectRequestStatus } from 'src/app/shared/projectRequestStatus';
import { ProjectRequestView } from 'src/app/shared/projectRequestView';
import { UserStoreService } from 'src/app/user-store.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-project-requests',
  templateUrl: './project-requests.component.html',
  styleUrls: ['./project-requests.component.css']
})
export class ProjectRequestsComponent implements OnInit {
  projectRequests: ProjectRequestView[] = [];
  requestId: number | undefined;
  requestStatuses: { [claimId: number]: string } = {};
  public userId!: string;
  projectRequestStatuses: ProjectRequestStatus[] = [];
  CurrentUser: number = 0;

  constructor(private apiService: APIService,
     private router: Router,
    private userStore: UserStoreService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private toast: NgToastService) {}

  ngOnInit(): void {
    const user = localStorage.getItem('CurrentUser');
   
    if(user != null)
    {
      this.CurrentUser = parseInt(user);
    }
    const storedStatuses = localStorage.getItem('requestStatuses');
    if (storedStatuses) {
      this.requestStatuses = JSON.parse(storedStatuses);
    }


    this.getAllProjectRequest();
    this.route.params.subscribe(params => {
      this.requestId = +params['requestId']; // Convert the claimId to a number
      // Fetch and display the claim details based on the claimId here
    });

  }
  getAllProjectRequest() {
    this.apiService.getAllProjectRequests().subscribe((result: ProjectRequestView[]) => {
      this.projectRequests = result;
      console.log('API Response:', result);


      // Fetch claim status for each claim
      for (const request of this.projectRequests) {
        this.getProjectRequestStatus(request.projectRequestStatusId);
      }
    });
  }

  getProjectRequestStatus(requestId: number): void {
    this.apiService.getProjectRequestStatus(requestId).subscribe(
      (status: any) => {
        // Store the claim status in the object using claimId as the key
        this.requestStatuses[requestId] = status.statusName;
      },
      error => {
        console.error('Error getting claim status:', error);
        // Handle the error, show a message to the user, etc.
      }
    );
  }
  submitProjectRequest(requestId: number): void {
    const confirmationMessage = 'Are you sure you want to submit the project request? Changes cannot be undone.';
 
    // Open the confirmation dialog
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Submission',
        message: confirmationMessage,
      },
      width: '350px',
      height: '200px',
      position: {
        top: '0px',
        left: '600px',
      }
    });
 
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User confirmed, proceed with submitting the claim
        this.apiService.submitProjectRequest(requestId).subscribe(
          () => {
            this.toast.success({
              detail: 'Success Message',
              summary: 'Claim submitted successfully.',
              duration: 15000,
            });
 
            // Update the claim status to 'Pending'
            this.requestStatuses[requestId] = 'Pending';
 
            // Store the updated claim statuses in localStorage
            localStorage.setItem('claimStatuses', JSON.stringify(this.requestStatuses));
          },
          (error) => {
            this.toast.error({
              detail: 'Submission unsuccessful!',
              summary: 'Error submitting claim.',
              duration: 5000,
            });
          }
        );
      }
    });
  }


}
