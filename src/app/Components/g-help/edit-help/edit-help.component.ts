import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HelpService } from 'src/app/services/help.service';
import { Help } from 'src/app/shared/help';
import { HelpTypeService } from 'src/app/services/help-type.service';
import { HelpType } from 'src/app/shared/helpType';
import { MatDialog } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-edit-help',
  templateUrl: './edit-help.component.html',
  styleUrls: ['./edit-help.component.css'],
})
export class EditHelpComponent implements OnInit {
  helpId!: number;
  help: Help | null = null;
  helpTypes: HelpType[] = [];


  // Add properties for form fields
  helpName: string = '';
  helpDescription: string = '';
  helpTypeId: number = 0;
  material: File | null = null;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private helpService: HelpService,
    private helpTypeService: HelpTypeService,
    private dialog: MatDialog,
    private toast: NgToastService
  ) {}


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.helpId = +params['id']; // Get the helpId from the route parameter
      this.loadHelp();
    });


    this.loadHelpTypes();
  }


  loadHelp(): void {
    this.helpService.GetHelp(this.helpId).subscribe((help: Help) => {
      this.help = help;
      this.helpName = help.helpName;
      this.helpDescription = help.helpDescription;
      this.helpTypeId = help.helpTypeId;
    });
  }


  loadHelpTypes(): void {
    this.helpTypeService.GetAllHelpType().subscribe((helpTypes: HelpType[]) => {
      this.helpTypes = helpTypes;
    });
  }


  updateHelp(): void {
    // Update the help object with new data
    if (this.help) {
      // Check if any changes were made
      const changesMade =
        this.help.helpName !== this.helpName ||
        this.help.helpDescription !== this.helpDescription ||
        this.help.helpTypeId !== this.helpTypeId ||
        this.material !== null;


      if (!changesMade) {
        // No changes were made
        this.toast.error({ detail: 'Error', summary: 'No changes made.', duration: 5000 });
      } else {
        // Changes were made, show confirmation dialog
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '250px',
          data: { title: 'Confirm Changes', message: 'Are you sure you want to save the changes?' },
        });


        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            // User confirmed changes, proceed with update
            this.performUpdate();
          }
        });
      }
    }
  }


  private performUpdate(): void {
    if (this.help) {
      // Update the help object with new data
      this.help.helpName = this.helpName;
      this.help.helpDescription = this.helpDescription;
      this.help.helpTypeId = this.helpTypeId;


      // Create a FormData object to send the updated help data
      const formData = new FormData();
      formData.append('helpName', this.help.helpName);
      formData.append('helpDescription', this.help.helpDescription);
      formData.append('helpTypeId', this.help.helpTypeId.toString());


      // Check if a new material file has been selected
      if (this.material) {
        formData.append('material', this.material);
      }


      // Call the service to update the help
      this.helpService.EditHelp(this.help.helpId, formData).subscribe(
        () => {
          // Show success message
          this.toast.success({ detail: 'Help updated successfully.', summary: 'Success', duration: 5000 });


          // Redirect to the help list page after successful update
          this.router.navigate(['/help']);
        },
        error => {
          // Handle update error here
        }
      );
    }
  }


  onMaterialChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.material = input.files[0];
    }
  }


  cancel(): void {
    this.router.navigate(['/help']);
  }
}


