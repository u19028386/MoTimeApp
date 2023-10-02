import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ConfirmationDialogComponent } from 'src/app/Components/confirmation-dialog/confirmation-dialog.component';
import { ClaimcaptureService } from 'src/app/services/claimcapture.service';
import { ClaimCaptureview } from 'src/app/shared/claimCaptureView';

@Component({
  selector: 'app-submittedclaim',
  templateUrl: './submittedclaim.component.html',
  styleUrls: ['./submittedclaim.component.css']
})
export class SubmittedclaimComponent implements OnInit {
  claims: ClaimCaptureview[] = [];
  claimId: number | undefined;
  claimStatuses: { [claimId: number]: string } = {}; // Object to store claim statuses
  role: string = "";


  constructor(
    private claimcaptureservice: ClaimcaptureService,
    private router: Router,
    private dialog: MatDialog,
    private toast: NgToastService
  ) {}


  ngOnInit(): void {
    this.getAllClaimCapture();


      var user = localStorage.getItem('CurrentUser');
      this.role =  ""+ localStorage.getItem('CurrentRole');

      if(this.role == "Administrator")
      {
        this.toast.error({detail: "ERROR", summary: "Access Denied"});
        this.router.navigate(['project-manager']);

      }
      if(this.role == "Consultant")
      {
      
        this.toast.error({detail: "ERROR", summary: "Access Denied"});
        this.router.navigate(['project-manager']);

      }
      if(this.role == "General Manager")
      {
        // can only view
        var user = localStorage.getItem('CurrentUser');

      }
      if(this.role == "Project Manager")
      {
          // do everything
      }
      if(this.role == "Operational Manager")
      {
          // do everything
      }

  }


  getAllClaimCapture() {
    this.claimcaptureservice.getAllClaimCaptures().subscribe((result: ClaimCaptureview[]) => {
      this.claims = result;
      console.log('API Response:', result);


      // Fetch claim status for each claim
      for (const claim of this.claims) {
        console.log(claim);
        this.getClaimStatus(claim.claimStatusId);
      }
    });
  }


  // Function to open the "Accept" confirmation dialog
  openAcceptConfirmationDialog(claimId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to accept this claim?' }
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User clicked "Yes" in the confirmation dialog
        this.AccptReject(claimId, 2); // Accept
      }
    });
  }


  // Function to open the "Reject" confirmation dialog
  openRejectConfirmationDialog(claimId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to reject this claim?' }
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User clicked "Yes" in the confirmation dialog
        this.AccptReject(claimId, 3); // Reject
      }
    });
  }


  AccptReject(claim: number, status: number) {
    console.log(claim);
    console.log(status);


    this.claimcaptureservice.AcceptOrReject(claim, status).subscribe(
      (response: any) => {
        location.reload();
      },
      error => {
        console.error('Error accepting/rejecting claim:', error);
        // Handle the error, show a message to the user, etc.
      }
    );
  }


  getClaimStatus(claimId: number): void {
    this.claimcaptureservice.getClaimCaptureStatusById(claimId).subscribe(
      (status: any) => {
        // Store the claim status in the object using claimId as the key
        this.claimStatuses[claimId] = status.statusName;
        console.log(this.claimStatuses[claimId]);
      },
      error => {
        console.error('Error getting claim status:', error);
        // Handle the error, show a message to the user, etc.
      }
    );
  }


  downloadProof(claim: ClaimCaptureview): void {
    this.claimcaptureservice.downloadClaimProof(claim.claimId).subscribe(
      (response: Blob) => {
        // Create a blob URL for the downloaded file
        const url = window.URL.createObjectURL(response);


        // Create an anchor element to trigger the download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'proof.pdf'; // You can set the filename here
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error => {
        console.error('Error downloading proof:', error);
        // Handle the error, show a message to the user, etc.
      }
    );
  }


  viewProof(claim: ClaimCaptureview): void {
    this.claimcaptureservice.viewClaimDocument(claim.claimId).subscribe(
      (response: Blob) => {
        // Create a blob URL for the viewed file
        const url = window.URL.createObjectURL(response);


        // Open the URL in a new tab/window for viewing
        window.open(url, '_blank');
      },
      error => {
        console.error('Error viewing proof:', error);
        // Handle the error, show a message to the user, etc.
      }
    );
  }
}
