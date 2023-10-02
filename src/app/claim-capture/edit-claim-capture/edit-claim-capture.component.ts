import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ConfirmationDialogComponent } from 'src/app/Components/confirmation-dialog/confirmation-dialog.component';
import { APIService } from 'src/app/services/api.service';
import { ClaimcaptureService } from 'src/app/services/claimcapture.service';
import { AuditLog } from 'src/app/shared/auditLog';
import { ClaimCapture } from 'src/app/shared/claimCapture';

@Component({
  selector: 'app-edit-claim-capture',
  templateUrl: './edit-claim-capture.component.html',
  styleUrls: ['./edit-claim-capture.component.css']
})
export class EditClaimCaptureComponent implements OnInit{
  claimId: number = 0;
  claimCapture: ClaimCapture | undefined;
  selectedFile!: File;
  currentFileName: string = '';
  updatedFileName: string = '';


  selectedAmount: number = 0;
  selectedDate: string = '';
  projectAllocationId: number = 0;


  originalAmount: number = 0;
  originalDate: string = '';
  originalFileName: string = '';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private claimCaptureService: ClaimcaptureService,
    private dialog: MatDialog,
    private toast: NgToastService
  ) {}


  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.claimId = +params['claimId'];
      this.populateEditForm();
    });
  }
 
  populateEditForm() {
    this.claimCaptureService.getClaimCapture(this.claimId).subscribe((claim) => {
      this.claimCapture = claim;
      this.selectedAmount = claim.amount;
      this.originalAmount = claim.amount; // Store the original amount
      if (claim.date != null) {
        this.selectedDate = new Date(claim.date).toISOString().slice(0, 10);
        this.originalDate = this.selectedDate; // Store the original date
      }
      this.projectAllocationId = claim.projectAllocationId;
      this.currentFileName = claim.proofName;
      this.originalFileName = claim.proofName; // Store the original file name
    });
  }


  onFileSelect(event: any) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      this.updatedFileName = this.selectedFile.name;
    }
  }


  onSubmit() {
    const hasChanges =
      (this.selectedFile !== null && this.selectedFile !== this.claimCapture?.uploadProof) ||
      this.selectedAmount !== this.originalAmount || // Compare with original amount
      this.selectedDate !== this.originalDate || // Compare with original date
      this.updatedFileName !== this.originalFileName; // Compare with original file name


    if (!hasChanges) {
      // No changes made
      this.toast.error({ detail: 'Error', summary: 'No changes made.', duration: 5000 });
      return;
    }
    if (this.selectedAmount < 1) {
      // No changes made
      this.toast.error({ detail: 'Error', summary: 'Claimable amount cannot be less than 1.', duration: 5000 });
      return;
    }
 
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Confirm Edit', message: 'Are you sure you want to edit this claim?' },
      width: '350px',
    });
 
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const formData = new FormData();
        formData.append('id', this.claimId + '');
        formData.append('ProjectAllocationId', this.projectAllocationId + '');
        formData.append('amount', this.selectedAmount + '');
        formData.append('UploadProof', this.selectedFile);
        formData.append('Date', this.selectedDate);
        formData.append('ProofName', this.currentFileName);
 
        this.claimCaptureService.updateClaimCapture(formData, this.claimId).subscribe(
          () => {
            this.originalAmount = this.selectedAmount; // Update original amount
            this.originalDate = this.selectedDate; // Update original date
            this.originalFileName = this.updatedFileName; // Update original file name
            this.toast.success({ detail: 'Success', summary: 'Claim edited successfully.', duration: 5000 });
            this.router.navigate(['/claimCapture']);
          },
          (error) => {
            this.toast.error({ detail: 'Error', summary: 'Failed to edit claim', duration: 5000 });
          }
        );
      }
    });
  }


  onCancel() {
    this.router.navigate(['/claimCapture']);
  }
}



