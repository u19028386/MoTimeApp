import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ClaimServiceService } from 'src/app/services/claim-service.service';
import { ClaimType } from 'src/app/shared/claimType';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { AuditLog } from 'src/app/shared/auditLog';
import { APIService } from 'src/app/services/api.service';


@Component({
  selector: 'app-edit-claim-type',
  templateUrl: './edit-claim-type.component.html',
  styleUrls: ['./edit-claim-type.component.css']
})
export class EditClaimTypeComponent implements OnInit{
  claimTypeForm = new FormGroup({
    claimTypeName: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]),
    claimTypeDescription: new FormControl('')
  });


  claimType: ClaimType | undefined;
  claimTypeId: number | undefined;


  constructor(
    private claimTypeService: ClaimServiceService,
    private router: Router,
    private dialog: MatDialog,
    private toast: NgToastService,
    private apService: APIService
  ) {}


  ngOnInit(): void {
    this.claimTypeId = parseInt(localStorage.getItem('claimTypeId')!, 10);
    if (isNaN(this.claimTypeId)) {
      
    } else {
      this.loadClaimType();
    }
  }


  loadClaimType(): void {
    this.claimTypeService.getClaimType(this.claimTypeId!).subscribe(result => {
      this.claimType = result;
      this.populateForm();
    });
  }


  populateForm(): void {
    if (this.claimType) {
      this.claimTypeForm.patchValue({
        claimTypeName: this.claimType.claimTypeName || '',
        claimTypeDescription: this.claimType.claimTypeDescription || ''
      });
    }
  }


  cancel(): void {
    localStorage.removeItem('claimTypeId');
    this.router.navigate(['/Claim-type']);
  }


 
  onSubmit(): void {
    if (this.claimType && this.claimTypeId) {
      const updatedClaimType: ClaimType = {
        claimTypeId: this.claimTypeId,
        claimTypeName: this.claimTypeForm.value.claimTypeName || '',
        claimTypeDescription: this.claimTypeForm.value.claimTypeDescription || ''
      };


       if (!/^[A-Za-z\s]+$/.test(updatedClaimType.claimTypeName)) {
        this.toast.error({
          detail: 'Validation Error',
          summary: 'Please enter a valid claim type name with no numbers or special characters.',
          duration: 5000
        });
        return;
      }
     
      if (
        updatedClaimType.claimTypeName === this.claimType.claimTypeName &&
        updatedClaimType.claimTypeDescription === this.claimType.claimTypeDescription
      ) {
        this.toast.error({ detail: 'Error', summary:'No changes made.' , duration: 5000 });
      } else {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
       
          data: { title: 'Confirm Chanages', message: 'Are you sure you want to save the changes?' },
         
      width: '350px',
      height: '200px',
      position: {
        top: '0px',
        left: '600px',}
        });


        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.claimTypeService.updateClaimType(updatedClaimType.claimTypeId, updatedClaimType).subscribe(
              result => {
                const CurrentName = localStorage.getItem('CurrentName');
            const CurrentUser = localStorage.getItem('CurrentUser');
            if(CurrentName && CurrentUser != null)
            {
              const auditLog: AuditLog = {
                auditId: 0, // Set the appropriate value
                actor: CurrentName,
                actionPerformed: 'Edit a claim type',
                entityType: 'ClaimType',
                userId: +CurrentUser,
                auditTimeStamp: new Date(Date.now()),
                criticalData: 'Successful edit of the claim type'
              };
              this.apService.logAudit(auditLog).subscribe(() => {
                console.log('Audit log for adding created successfully.');
              });
            }
                this.toast.success({ detail: 'Success', summary: 'Claim type edited successfully.', duration: 5000 });
                this.router.navigate(['/Claim-type']);
              },
              error => {
                const CurrentName = localStorage.getItem('CurrentName');
                const CurrentUser = localStorage.getItem('CurrentUser');
                if(CurrentName && CurrentUser != null)
                {
                  const auditLog: AuditLog = {
                    auditId: 0, // Set the appropriate value
                    actor: CurrentName,
                    actionPerformed: 'Edit a claim type',
                    entityType: 'ClaimType',
                    userId: +CurrentUser,
                    auditTimeStamp: new Date(Date.now()),
                    criticalData: 'Unsuccessful edit of the claim type ' + error
                  };
                  this.apService.logAudit(auditLog).subscribe(() => {
                    console.log('Audit log for adding created successfully.');
                  });
                }
                this.toast.error({ detail: 'Error', summary: 'Claim type not updated', duration: 5000 });
              }
            );
          }
        });
      }
    }
  }


}
