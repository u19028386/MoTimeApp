import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { APIService } from 'src/app/services/api.service';
import { ClaimcaptureService } from 'src/app/services/claimcapture.service';
import { AuditLog } from 'src/app/shared/auditLog';
import { ProjectAllocation } from 'src/app/shared/pAllocation';
import { Project } from 'src/app/shared/pProject';

@Component({
  selector: 'app-add-claim-capture',
  templateUrl: './add-claim-capture.component.html',
  styleUrls: ['./add-claim-capture.component.css']
})
export class AddClaimCaptureComponent implements OnInit {
  captureForm = new FormGroup({
    employeeId: new FormControl('', Validators.required),
    projectAllocationId: new FormControl('', Validators.required),
    projectId: new FormControl('', Validators.required),
    claim: new FormControl({ value: '', disabled: true }),
    claimableAmount: new FormControl({ value: '', disabled: true }),
    pName: new FormControl({ value: '', disabled: true }),
    amount: new FormControl('', [Validators.required, this.amountValidator.bind(this)]),
    date: new FormControl('', [Validators.required]),
    uploadProof: new FormControl(null, Validators.required), // Required file upload
  });


  allocations: ProjectAllocation[] = [];
  filteredProjects: ProjectAllocation[] = [];
  projectStartDate: Date | null = null;
  projectEndDate: Date | null = null;
  role: string ="";
  emp: number =0 ;
  flag: boolean = false;
  employeeId : number =0;
  isDropdownLocked: boolean = true; // Set to true to lock the dropdown, set to false to unlock it
  isDisabled: boolean = true; // Set to true to disable the dropdown, set to false to enable it

  constructor(private formBuilder: FormBuilder ,private claimCaptureService: ClaimcaptureService, private router: Router, private toastr: NgToastService,) {}
  toggleDropdownLock() {
    this.isDropdownLocked = !this.isDropdownLocked;
  }
  

  ngOnInit(): void {
    this.getAllocationsWithEligibility();


   
   

    var user = localStorage.getItem('CurrentUser');
    this.role =  ""+ localStorage.getItem('CurrentRole');

    if(this.role == "Administrator")
    {
      this.toastr.error({detail: "ERROR", summary: "Access Denied"});
      this.router.navigate(['project-manager']);

    }
    if(this.role == "Consultant")
    {

      this.flag = true;
    
    }
    if(this.role == "General Manager")
    {
      this.toastr.error({detail: "ERROR", summary: "Access Denied"});
      this.router.navigate(['project-manager']);
      // can only view
      var user = localStorage.getItem('CurrentUser');

    }
    if(this.role == "Project Manager")
    {
      this.toastr.error({detail: "ERROR", summary: "Access Denied"});
      this.router.navigate(['project-manager']);
        // do everything
    }
    if(this.role == "Operational Manager")
    {
      this.toastr.error({detail: "ERROR", summary: "Access Denied"});
      this.router.navigate(['project-manager']);
        // do everything
    }
  }


  cancel() {
    this.router.navigate(['/claimCapture']);
  }


  getAllocationsWithEligibility() {
    this.claimCaptureService.getAllAllocations().subscribe((allocations: ProjectAllocation[]) => {
      console.log('Raw API Response:', allocations);

      if(this.flag)
      {
        var user = localStorage.getItem('CurrentUser');
        if(user!=null)
        {

          var intuser = parseInt(user);
          const foundAllocation = allocations.find((allocation) => allocation.userId === intuser);
          console.log(foundAllocation);
          var findEmpl = allocations
          if(foundAllocation!=null)
          {
            this.employeeId = foundAllocation.employeeId;
          }
          this.onEmployeeChange();
        }
        console.log("------------->", this.employeeId);
        const selectedEmployeeId: number = this.employeeId;
        this.filteredProjects = allocations.filter(allocation => allocation.employeeId === this.employeeId);
        console.log("------------->",allocations);
        this.captureForm.patchValue({
          projectId: '',
          claim: '',
          claimableAmount: '',
          pName: '',
          projectAllocationId: '',
        });
      }

      this.allocations = allocations.filter(allocation => allocation.isEligibleToClaim === true);
      console.log('Filtered Allocations:', this.allocations);
    });
  }

  onEmployeeChange() {
    this.updateClaimAndClaimableAmount();
  }

  onProjectChange() {
    const selectedProjectId: number = parseInt(this.captureForm.get('projectId')?.value || '0', 10);
    const selectedProjectAllocation = this.filteredProjects.find(project => project.projectAllocationId === selectedProjectId);
 
    if (selectedProjectAllocation) {
      this.claimCaptureService.getProject(selectedProjectAllocation.projectId)
        .subscribe((project: Project) => {
          if (project) {
            this.projectStartDate = new Date(project.startDate);
            this.projectEndDate = new Date(project.endDate);
           
            // Update the date input field attributes
            this.setDateRange();
           
            this.captureForm.patchValue({
              projectAllocationId: selectedProjectAllocation.projectAllocationId.toString(),
              claim: selectedProjectAllocation.claim || '',
              claimableAmount: selectedProjectAllocation.claimableAmount?.toString() || '',
              pName: selectedProjectAllocation.pName || ''
            });
          } else {
            console.error('Project not found.');
          }
        });
    }
  }
 
  amountValidator(control: AbstractControl): ValidationErrors | null {
    const amount = parseFloat(control.value);


    if (isNaN(amount) || amount < 0) {
      return { negativeAmount: true };
    }


    const claimableAmount = parseFloat(this.captureForm.get('claimableAmount')?.value || '0');


    if (amount > claimableAmount) {
      return { amountExceedsClaimable: true };
    }


    return null;
  }


  private updateClaimAndClaimableAmount(selectedProject?: ProjectAllocation) {
    if (selectedProject) {
      const claimableAmountAsString: string = selectedProject.claimableAmount.toString();
      this.captureForm.patchValue({
        claim: selectedProject.claim,
        claimableAmount: claimableAmountAsString,
        pName: selectedProject.pName
      });
    }
  }


  onSubmit() {
    const projectAllocationId: number = parseInt(this.captureForm.get('projectAllocationId')?.value || '0', 10);
    const amount: number = parseFloat(this.captureForm.get('amount')?.value || '0');
    const dateString: string = this.captureForm.get('date')?.value || '';
    const date: Date = dateString ? new Date(dateString) : new Date();
    const uploadProof: File | null = this.captureForm.get('uploadProof')?.value as File | null;
 
    // Check if no file is selected
    if (!uploadProof) {
      this.captureForm.get('uploadProof')?.setErrors({ noFileSelected: true });
      return;
    }
    if (amount < 1) {
      // No changes made
      this.toastr.error({ detail: 'Error', summary: 'Claimable amount cannot be less than 1.', duration: 5000 });
      return;
    }
 
    if (uploadProof instanceof File) {
      const formData = new FormData();
      formData.append('ProjectAllocationId', projectAllocationId.toString());
      formData.append('Amount', amount.toString());
      formData.append('Date', date.toISOString());
      formData.append('UploadProof', uploadProof);
 
      // Add the file name to the FormData
      formData.append('ProofName', uploadProof.name);
 
      this.claimCaptureService.addClaimCapture(formData).subscribe(
        () => {
          // Success: Display a success toast
          this.toastr.success({
            detail: 'Success Message',
            summary: 'Claim submitted successfully.',
            duration: 15000,
          });
 
          // Navigate back to '/claimCapture' on successful submission
          this.router.navigate(['/claimCapture']);
        },
        (error) => {
          // Error: Display a failure toast
          this.toastr.error({
            detail: 'Error Message',
            summary: 'Claim submission failed. Please try again.',
            duration: 15000,
          });
          console.error('Claim submission failed:', error);
        }
      );
    } else {
      console.error('Invalid file selected.');
    }

  }
 


  onFileChange(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.captureForm.get('uploadProof')?.setValue(files[0]);
    } else {
      const inputElement = document.createElement('input');
      inputElement.type = 'file';
      inputElement.id = 'uploadProof';
      inputElement.accept = '.pdf';
      inputElement.name = 'uploadProof';
      inputElement.addEventListener('change', this.onFileChange.bind(this));


      const oldInputElement = document.getElementById('uploadProof');
      if (oldInputElement && oldInputElement.parentNode) {
        oldInputElement.parentNode.replaceChild(inputElement, oldInputElement);
      }


      this.captureForm.get('uploadProof')?.setValue(null);
    }
  }


  private setDateRange() {
    // Get the date input element
    const dateInput = document.getElementById('date');


    if (dateInput && this.projectStartDate && this.projectEndDate) {
      // Set the minimum and maximum date attributes to restrict date selection
      dateInput.setAttribute('min', this.projectStartDate.toISOString().split('T')[0]);
      dateInput.setAttribute('max', this.projectEndDate.toISOString().split('T')[0]);
    }
  }
}


