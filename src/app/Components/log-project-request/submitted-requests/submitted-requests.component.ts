import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { APIService } from 'src/app/services/api.service';
import { ProjectRequestView } from 'src/app/shared/projectRequestView';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-submitted-requests',
  templateUrl: './submitted-requests.component.html',
  styleUrls: ['./submitted-requests.component.css']
})
export class SubmittedRequestsComponent implements OnInit{
  requests: ProjectRequestView[] = [];
  requestId: number | undefined;
  requestStatuses: { [requestId: number]: string } = {};
  constructor(
    private apiService: APIService,
    private router: Router,
    private dialog: MatDialog,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    this.getAllProjectRequests();
  }

  getAllProjectRequests() {
    this.apiService.getAllProjectRequests().subscribe((result: ProjectRequestView[]) => {
      this.requests = result;
      console.log('API Response:', result);


      // Fetch claim status for each claim
      for (const claim of this.requests) {
        this.getProjectRequestStatus(claim.projectRequestStatusId);
      }
    });
  }

  openAcceptConfirmationDialog(requestId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to accept this claim?' }
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User clicked "Yes" in the confirmation dialog
        this.AccptReject(requestId, 2); // Accept
      }
    });
  }
  openRejectConfirmationDialog(requestId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to reject this project request?' }
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User clicked "Yes" in the confirmation dialog
        this.AccptReject(requestId, 3); // Reject
      }
    });
  }

  AccptReject(request: number, status: number) {
    console.log(request);
    console.log(status);


    this.apiService.AcceptOrReject(request, status).subscribe(
      (response: any) => {
        location.reload();
      },
      error => {
        console.error('Error accepting/rejecting claim:', error);
        // Handle the error, show a message to the user, etc.
      }
    );
  }

  getProjectRequestStatus(requestId: number): void {
    this.apiService.getProjectRequestStatus(requestId).subscribe(
      (status: any) => {
        // Store the claim status in the object using claimId as the key
        this.requestStatuses[requestId] = status.statusName;
        console.log(this.requestStatuses[requestId]);
      },
      error => {
        console.error('Error getting claim status:', error);
        // Handle the error, show a message to the user, etc.
      }
    );
  }


}
