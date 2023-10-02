import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClaimItem } from 'src/app/shared/claimItem';
import { ClaimType } from 'src/app/shared/claimType';
import { ClaimServiceService } from 'src/app/services/claim-service.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
import { AuditLog } from 'src/app/shared/auditLog';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-edit-claim-item',
  templateUrl: './edit-claim-item.component.html',
  styleUrls: ['./edit-claim-item.component.css']
})
export class EditClaimItemComponent implements OnInit {
  claimItemId!: number;
  claimItem: ClaimItem = {
    claimItemId: 0,
    claimTypeId: null,
    claimItemName: ''
  };
  claimType: ClaimType | null = null;
  claimTypes: ClaimType[] = [];


  claimItemForm: FormGroup;
  claimTypeIdForm: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    private claimService: ClaimServiceService,
    
    private router: Router,
    private toast: NgToastService,
    private dialog: MatDialog,
    private apService: APIService
  ) {
    this.claimItemForm = this.formBuilder.group({
      claimItemName: ['', [Validators.required, this.noNumbersValidator]],
    });


    this.claimTypeIdForm = this.formBuilder.group({
      claimTypeId: [null]
    });
  }


  ngOnInit(): void {
    const storedClaimItemId = localStorage.getItem('claimItemId');
    if (storedClaimItemId !== null) {
      this.claimItemId = +storedClaimItemId;
      this.loadClaimItemAndType();
      this.loadAllClaimTypes();
    } else {
      console.error('Claim item ID not found in local storage.');
    }


    this.claimTypeIdForm.get('claimTypeId')?.valueChanges.subscribe(() => {
      this.loadClaimType();
      this.claimItemForm.get('claimItemName')?.updateValueAndValidity();
    });
  }


  loadClaimItemAndType(): void {
    this.claimService.getClaimItem(this.claimItemId).subscribe(
      (claimItem: ClaimItem) => {
        this.claimItem = claimItem;
        this.loadClaimType();
        this.populateForm();
      },
      error => {
        console.error('Error loading claim item:', error);
      }
    );
  }


  loadAllClaimTypes(): void {
    this.claimService.getAllClaimTypes().subscribe(
      (claimTypes: ClaimType[]) => {
        this.claimTypes = claimTypes;
      },
      error => {
        console.error('Error loading claim types:', error);
      }
    );
  }


  loadClaimType(): void {
    if (this.claimItem.claimTypeId !== null && this.claimTypes) {
      this.claimType = this.claimTypes.find(type => type.claimTypeId === this.claimItem.claimTypeId) || null;
    } else {
      this.claimType = null;
    }
  }


  updateClaimItemAndType(): void {
    if (this.claimItem && this.claimItemId) {
      const updatedClaimItem: ClaimItem = {
        claimItemId: this.claimItemId,
        claimTypeId: this.claimTypeIdForm.value.claimTypeId,
        claimItemName: this.claimItemForm.value.claimItemName || ''
      };


      if (
        updatedClaimItem.claimTypeId === this.claimItem.claimTypeId &&
        updatedClaimItem.claimItemName === this.claimItem.claimItemName
      ) {
        this.toast.error({ detail: 'Error', summary: 'No changes made.', duration: 5000 });
      } else {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
       
          data: { title: 'Confirm Changes', message: 'Are you sure you want to save the changes?' },
          width: '350px',
          height: '200px',
          position: {
            top: '0px',
            left: '600px',}
         
   
        });


        dialogRef.afterClosed().subscribe((result: boolean) => {
          if (result) {
            this.claimService.updateClaimItem(this.claimItemId, updatedClaimItem).subscribe(
              result => {
                const CurrentName = localStorage.getItem('CurrentName');
            const CurrentUser = localStorage.getItem('CurrentUser');
            if(CurrentName && CurrentUser != null)
            {
              const auditLog: AuditLog = {
                auditId: 0, // Set the appropriate value
                actor: CurrentName,
                actionPerformed: 'Edit a claim item',
                entityType: 'ClaimItem',
                userId: +CurrentUser,
                auditTimeStamp: new Date(Date.now()),
                criticalData: 'Successful edit of the claim item'
              };
              this.apService.logAudit(auditLog).subscribe(() => {
                console.log('Audit log for adding created successfully.');
              });
            }
                this.toast.success({ detail: 'Success', summary: 'Claim item edited successfully.', duration: 5000 });
                this.router.navigate(['/Claim-item']);
              },
              error => {
                this.toast.error({ detail: 'Error', summary: 'Claim item not updated', duration: 5000 });
                const CurrentName = localStorage.getItem('CurrentName');
                const CurrentUser = localStorage.getItem('CurrentUser');
                if(CurrentName && CurrentUser != null)
                {
                  const auditLog: AuditLog = {
                    auditId: 0, // Set the appropriate value
                    actor: CurrentName,
                    actionPerformed: 'Edit a claim item',
                    entityType: 'ClaimItem',
                    userId: +CurrentUser,
                    auditTimeStamp: new Date(Date.now()),
                    criticalData: 'Unsuccessful edit of the claim item'
                  };
                  this.apService.logAudit(auditLog).subscribe(() => {
                    console.log('Audit log for adding created successfully.');
                  });
                }
              }
            );
          }
        });
      }
    }
  }


  populateForm(): void {
    this.claimItemForm.patchValue({
      claimItemName: this.claimItem.claimItemName || ''
    });


    this.claimTypeIdForm.patchValue({
      claimTypeId: this.claimItem.claimTypeId || null
    });
  }


  cancel(): void {
    localStorage.removeItem('claimItemId');
    this.router.navigate(['/Claim-item']);
  }


  noNumbersValidator(control: AbstractControl): { [key: string]: any } | null {
    const pattern = /^[A-Za-z\s]+$/;
    if (control.value && !pattern.test(control.value)) {
      this.toast.error({
        detail: 'Validation Error',
        summary: 'Please enter a valid claim item name with no numbers or special characters.',
        duration: 5000
      });
      return { 'noNumbers': true };
    }
    return null;
  }
}



