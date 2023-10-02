import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Project } from 'src/app/shared/project';
import { Client } from 'src/app/shared/client';
import { NgToastService } from 'ng-angular-popup';
import { Projectstatus } from 'src/app/shared/projectstatus';
import { APIService } from 'src/app/services/api.service';
import { AuditLog } from 'src/app/shared/auditLog';

@Component({
  selector: 'app-add-project',  
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {  
  projectForm = new FormGroup({  
    projectName: new FormControl('', Validators.required),  
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl('', Validators.required),
    clientId: new FormControl('', Validators.required),
    projectStatusId: new FormControl(1, Validators.required) // Set default to 1 for 'Not Started'
  });


  existingProjectNames: string[] = [];
  projectstatuses: Projectstatus[] = [];
  clients: Client[] = [];
  isSubmitted: boolean = false;


  constructor(
    private dataService: DataService,
    private router: Router,
    private toast: NgToastService,
    private apiService: APIService
  ) {}


  ngOnInit(): void {
    this.getExistingProjectNames();
    this.getClients();
    this.getProjectStatuses();


    // Set the default project status to 'Not Started'
    this.projectForm.get('projectStatusId')?.setValue(1); // Replace 1 with the actual ID of 'Not Started'


    // Set a default start date, e.g., today
    const currentDate = this.getCurrentDate();
    this.projectForm.get('startDate')?.setValue(currentDate);

    const CurrentRole = localStorage.getItem('CurrentRole');
    if(CurrentRole != "Administrator")
    {
      this.router.navigate(['unauthorised']);
    }
 
  }


  getExistingProjectNames() {
    this.dataService.getProjects().subscribe((projects: Project[]) => {
      this.existingProjectNames = projects.map(
        (project) => project.projectName
      );
    });
  }


  getClients() {
    this.dataService.getClients().subscribe((clients: Client[]) => {
      this.clients = clients;
    });
  }


  getProjectStatuses() {
    this.dataService.getProjectStatuses().subscribe((projectstatuses: Projectstatus[]) => {
      this.projectstatuses = projectstatuses;
    });
  }


  cancel() {
    this.router.navigate(['/project']);
  }


  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  onSubmit() {
    this.isSubmitted = true;


    if (this.projectForm.invalid) {
      return;
    }


    const projectName: string = this.projectForm.get('projectName')?.value || '';
    const enddateString: string = this.projectForm.get('endDate')?.value || '';
    const startdateString: string = this.projectForm.get('startDate')?.value || '';
    const clientId: number = parseInt(this.projectForm.get('clientId')?.value ?? '0', 10);


    const projectStatusValue = this.projectForm.get('projectStatusId')?.value;
    let projectStatusId: number;


    if (typeof projectStatusValue === 'string') {
      projectStatusId = parseInt(projectStatusValue, 10);
    } else {
      projectStatusId = projectStatusValue as number;
    }


    const startDate: Date = startdateString ? new Date(startdateString) : new Date();
    const endDate: Date = enddateString ? new Date(enddateString) : new Date();
 
    if (this.existingProjectNames.includes(projectName)) {
      this.toast.error({
        detail: 'Error Message',
        summary: 'Project name already exists. Please enter a unique name.',
        duration: 5000
      });
 
      return;
    }
 
    const project: Project = {
      projectId: 0,
      projectName: projectName,
      startDate: startDate,
      endDate: endDate,
      clientId: clientId,
      projectStatusId: projectStatusId
    };
 
    this.dataService.addProject(project).subscribe((result) => {
      const CurrentName = localStorage.getItem('CurrentName');
            const CurrentUser = localStorage.getItem('CurrentUser');
            if(CurrentName && CurrentUser != null)
            {
              const auditLog: AuditLog = {
                auditId: 0, // Set the appropriate value
                actor: CurrentName,
                actionPerformed: 'Add a project',
                entityType: 'Project',
                userId: +CurrentUser,
                auditTimeStamp: new Date(Date.now()),
                criticalData: 'Successful adding of a project '
              };
              this.apiService.logAudit(auditLog).subscribe(() => {
                console.log('Audit log for adding logging in created successfully.');
              });
            }
      this.toast.success({
        
        detail: 'Success Message', summary: 'Project added successfully', duration: 5000
      });
      this.router.navigate(['/project']);
    },
    error => {
      const CurrentName = localStorage.getItem('CurrentName');
            const CurrentUser = localStorage.getItem('CurrentUser');
            if(CurrentName && CurrentUser != null)
            {
              const auditLog: AuditLog = {
                auditId: 0, // Set the appropriate value
                actor: CurrentName,
                actionPerformed: 'Add a project',
                entityType: 'Project',
                userId: +CurrentUser,
                auditTimeStamp: new Date(Date.now()),
                criticalData: 'Unsuccessful adding of a project '
              };
              this.apiService.logAudit(auditLog).subscribe(() => {
                console.log('Audit log for adding logging in created successfully.');
              });
            }
      this.toast.error({
        detail: 'Error Message', summary: 'Project could not be added.', duration: 5000
      });
    });
  }
 
}




