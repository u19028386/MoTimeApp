import { Component, OnInit } from '@angular/core';
import { ClaimCaptureview } from '../shared/claimCaptureView';
import { ClaimcaptureService } from '../services/claimcapture.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';
import { HttpClient } from '@angular/common/http';
import { ConfirmationDialogComponent } from '../Components/confirmation-dialog/confirmation-dialog.component';
import { AuditLog } from '../shared/auditLog';
import { APIService } from '../services/api.service';

@Component({
  selector: 'app-claim-capture',
  templateUrl: './claim-capture.component.html',
  styleUrls: ['./claim-capture.component.css']
})
export class ClaimCaptureComponent implements OnInit{
  claims: ClaimCaptureview[] = [];
  claimId: number | undefined;
  claimStatuses: { [claimId: number]: string } = {}; // Object to store claim statuses
  hoveredClaimId: number = 0;
  hoverMessage: string = '';
  role : string = ''; 

  constructor(
    private claimcaptureservice: ClaimcaptureService,
    private router: Router,
    private dialog: MatDialog,
    private toast: NgToastService,
    private route: ActivatedRoute
  ) {}


  ngOnInit(): void {
    // Load claim statuses from localStorage when the component initializes
    const storedStatuses = localStorage.getItem('claimStatuses');
    if (storedStatuses) {
      this.claimStatuses = JSON.parse(storedStatuses);
    }

    var user = localStorage.getItem('CurrentUser');
    this.role =  ""+ localStorage.getItem('CurrentRole');

    this.getAllClaimCapture();
    this.route.params.subscribe(params => {
      this.claimId = +params['claimId']; // Convert the claimId to a number
      // Fetch and display the claim details based on the claimId here
    });




    if(this.role == "Administrator")
    {
      this.toast.error({detail: "ERROR", summary: "Access Denied"});
      this.router.navigate(['project-manager']);

    }
    if(this.role == "Consultant")
    {
    
     

    }
    if(this.role == "General Manager")
    {
      // can only view
      var user = localStorage.getItem('CurrentUser');
      this.toast.error({detail: "ERROR", summary: "Access Denied"});
      this.router.navigate(['project-manager']);

    }
    if(this.role == "Project Manager")
    {
       this.toast.error({detail: "ERROR", summary: "Access Denied"});
      this.router.navigate(['project-manager']);
        // do everything
    }
    if(this.role == "Operational Manager")
    {
      this.toast.error({detail: "ERROR", summary: "Access Denied"});
      this.router.navigate(['project-manager']);
        // do everything
    }


  }


  getAllClaimCapture() {

   

    this.claimcaptureservice.getAllClaimCaptures().subscribe((result: ClaimCaptureview[]) => {
      
      var user = localStorage.getItem('CurrentUser');
      var userid =0;
      if(user!=null)
      {
        userid = parseInt(user);
      }
      const filteredClaims = result.filter((result) => result.userId === userid);
      console.log("-------------->", filteredClaims);
      this.claims =   filteredClaims;

      console.log('API Response:', result);


      // Fetch claim status for each claim
      for (const claim of this.claims) {
        this.getClaimStatus(claim.claimStatusId);
      }
    });
  }


  getClaimStatus(claimId: number): void {
    this.claimcaptureservice.getClaimCaptureStatusById(claimId).subscribe(
      (status: any) => {
        // Store the claim status in the object using claimId as the key
        this.claimStatuses[claimId] = status.statusName;
      },
      error => {
        console.error('Error getting claim status:', error);
        // Handle the error, show a message to the user, etc.
      }
    );
  }


  editClaim(claim: ClaimCaptureview): void {
    if (this.claimStatuses[claim.claimId] !== 'Pending') {
      this.router.navigate(['/editclaimcapture', claim.claimId]);
    } else {
      this.toast.error({
        detail: 'Edit not allowed for submitted claim.',
        summary: 'Error',
        duration: 5000,
      });
    }
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


  deleteClaim(claimId: number): void {
    if (this.claimStatuses[claimId] === 'Pending') {
      this.toast.error({
        detail: 'Delete not allowed for submitted claim.',
        summary: 'Error',
        duration: 5000,
      });
    } else {
      const confirmationMessage = 'Are you sure you want to delete this claim?';


      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: {
          title: 'Confirm Deletion',
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
          this.claimcaptureservice.deleteClaimCapture(claimId).subscribe(
            () => {
              this.toast.success({
                detail: 'Success Message',
                summary: 'Claim deleted successfully.',
                duration: 15000,
              });


              setTimeout(() => {
                window.location.reload();
              }, 2000);
            },
            error => {
              this.toast.error({
                detail: 'Deletion unsuccessful!',
                summary: 'Error deleting claim.',
                duration: 5000,
              });
            }
          );
        }
      });
    }
  }


  submitClaim(claimId: number): void {
    const confirmationMessage = 'Are you sure you want to submit the captured claim? Changes cannot be undone.';
 
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
        this.claimcaptureservice.submitClaimCapture(claimId).subscribe(
          () => {
            this.toast.success({
              detail: 'Success Message',
              summary: 'Claim submitted successfully.',
              duration: 15000,
            });
 
            // Update the claim status to 'Pending'
            this.claimStatuses[claimId] = 'Pending';
 
            // Store the updated claim statuses in localStorage
            localStorage.setItem('claimStatuses', JSON.stringify(this.claimStatuses));
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


  onButtonHover(claimId: number, message: string): void {
    this.hoveredClaimId = claimId;
    this.hoverMessage = message;
  }

}
