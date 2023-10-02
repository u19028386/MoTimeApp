import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Employee } from 'src/app/shared/employee';
import { Eemployee } from 'src/app//shared/eemployee';
import { User } from 'src/app/shared/user';
import { Employeetype } from 'src/app//shared/employeetype';
import { Employeestatus } from 'src/app//shared/employeestatus';
import { Region } from 'src/app/shared/region';
import { Division } from 'src/app/shared/division';
import { Managertype } from 'src/app/shared/managertype';
import { Resource } from 'src/app/shared/resource';
import { NgToastService } from 'ng-angular-popup';
import { Employee2 } from 'src/app/shared/Employee2';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { APIService } from 'src/app/services/api.service';
import { AuditLog } from 'src/app/shared/auditLog';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  existingUserIds: Number[] = [];
  existingEmployeeUserIds: Number[] = [];
  existingUserNames: string[] = [];
  employees: Employee2[] = [];
  users: User[] = [];
  employeeTypes: Employeetype[] = [];
  employeeStatuses: Employeestatus[] = [];
  regions: Region[] = [];
  divisions: Division[] = [];
  managerTypes: Managertype[] = [];
  resources: Resource[] = [];
  isSubmitted: boolean = false;
  // showManagerTypeDropdown: boolean = false;
  filteredUsers: User[] = [];


  constructor(
    private dataService: DataService,
    private router: Router,
    private toast: NgToastService,
    private formBuilder: FormBuilder,
    private apService: APIService
  ) {
    this.employeeForm = this.formBuilder.group({
      userId: ['', Validators.required],
      resourceId: ['', Validators.required],
      employeeTypeId: ['', Validators.required],
      employeeStatusId: ['', Validators.required],
      regionId: ['', Validators.required],
      divisionId: ['', Validators.required],
      managerTypeId: ['']
    });
  }


  ngOnInit(): void {
    this.getUsers();
    this.getEmployeeTypes();
    this.getEmployeeStatuses();
    this.getRegions();
    this.getDivisions();
    this.getManagerTypes();
    this.getResources();
    this.getEmployees();
    this.getExistingEmployeeUserIds();
    this.onEmployeeTypeChange();
    this.filteredUsers = [...this.users];
    const CurrentRole = localStorage.getItem('CurrentRole');
    if(CurrentRole != "Administrator")
    {
      this.router.navigate(['unauthorised']);
    }
  }


  filterUsers(event: Event) {
    const searchTerm = (event.target as HTMLInputElement)?.value || '';
    this.filteredUsers = this.users.filter((user) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }
 
  onEmployeeTypeChange() {
    const selectedEmployeeType = this.employeeForm.get('employeeTypeId')?.value;
 
    // checking for consultant becasue ID is 2
    if (selectedEmployeeType === '2') {
      this.employeeForm.get('managerTypeId')?.disable();
    }
   
    else {
      this.employeeForm.get('managerTypeId')?.enable();
    }
  }
 






  getUsers() {
    this.dataService.getUsers().subscribe((users: User[]) => {
      this.users = users;
      this.existingUserIds = users.map(user => user.userId);
      this.existingUserNames = users.map(user => `${user.firstName} ${user.lastName}`);
      console.log(this.existingUserIds);
    });
  }


  getExistingEmployeeUserIds() {
    this.dataService.getEmployees().subscribe((employees: Employee[]) => {
      this.existingEmployeeUserIds = employees
        .map((employee) => employee.userId)
        .filter((Id) => Id !== null) as number[];
    });
  }


  getEmployees() {
    this.dataService.getEmployees().subscribe((eemployees: Employee2[]) => {
      this.employees = eemployees;
    });


    this.existingEmployeeUserIds = this.employees.map(employee => employee.userId);
  }


  getResources() {
    this.dataService.getResources().subscribe((resources: Resource[]) => {
      this.resources = resources;
    });
  }


  getRegions() {
    this.dataService.getRegions().subscribe((regions: Region[]) => {
      this.regions = regions;
    });
  }


  getDivisions() {
    this.dataService.getDivisions().subscribe((divisions: Division[]) => {
      this.divisions = divisions;
    });
  }


  getManagerTypes() {
    this.dataService.getManagerTypes().subscribe((managerTypes: Managertype[]) => {
      this.managerTypes = managerTypes;
    });
  }


  getEmployeeStatuses() {
    this.dataService.getEmployeeStatuses().subscribe((employeeStatuses: Employeestatus[]) => {
      this.employeeStatuses = employeeStatuses;
    });
  }


  getEmployeeTypes() {
    this.dataService.getEmployeeTypes().subscribe((employeeTypes: Employeetype[]) => {
      this.employeeTypes = employeeTypes;
    });
  }


  cancel() {
    this.router.navigate(['/employees']);
  }


  onSubmit() {
    this.isSubmitted = true;


    if (this.employeeForm.invalid) {
      return;
    }


    const userId: number = parseInt(this.employeeForm.get('userId')?.value ?? '0', 10);
    const resourceId: number = parseInt(this.employeeForm.get('resourceId')?.value ?? '0', 10);
    const regionId: number = parseInt(this.employeeForm.get('regionId')?.value ?? '0', 10);
    const divisionId: number = parseInt(this.employeeForm.get('divisionId')?.value ?? '0', 10);
    const managerTypeId: number = parseInt(this.employeeForm.get('managerTypeId')?.value ?? '0', 10);
    const employeeStatusId: number = parseInt(this.employeeForm.get('employeeStatusId')?.value ?? '0', 10);
    const employeeTypeId: number = parseInt(this.employeeForm.get('employeeTypeId')?.value ?? '0', 10);


    if (this.existingEmployeeUserIds.includes(userId)) {
      this.toast.error({
        detail: 'Error Message',
        summary: 'User already exists as an employee. Please pick another user.',
        duration: 5000
      });


      return;
    }


    const employee: Employee2 = {
      employeeId: 0,
      userId: userId,
      resourceId: resourceId,
      regionId: regionId,
      divisionId: divisionId,
      managerTypeId: managerTypeId,
      employeeStatusId: employeeStatusId,
      employeeTypeId: employeeTypeId
    };


    this.dataService.addEmployee(employee).subscribe(
      (result) => {
        const CurrentName = localStorage.getItem('CurrentName');
            const CurrentUser = localStorage.getItem('CurrentUser');
            if(CurrentName && CurrentUser != null)
            {
              const auditLog: AuditLog = {
                auditId: 0, // Set the appropriate value
                actor: CurrentName,
                actionPerformed: 'Add employee',
                entityType: 'Employee',
                userId: +CurrentUser,
                auditTimeStamp: new Date(Date.now()),
                criticalData: 'Successful addition of the employee'
              };
              this.apService.logAudit(auditLog).subscribe(() => {
                console.log('Audit log for adding logging in created successfully.');
              });
            }
        this.toast.success({
          detail: 'Success Message',
          summary: 'Employee added successfully.',
          duration: 5000
        });
        this.router.navigate(['/employees']);
      },
      (error) => {
        const CurrentName = localStorage.getItem('CurrentName');
            const CurrentUser = localStorage.getItem('CurrentUser');
            if(CurrentName && CurrentUser != null)
            {
              const auditLog: AuditLog = {
                auditId: 0, // Set the appropriate value
                actor: CurrentName,
                actionPerformed: 'Add employee',
                entityType: 'Employee',
                userId: +CurrentUser,
                auditTimeStamp: new Date(Date.now()),
                criticalData: 'Unsuccessful addition of the employee'
              };
              this.apService.logAudit(auditLog).subscribe(() => {
                console.log('Audit log for adding logging in created successfully.');
              });
            }
        this.toast.error({
          detail: 'Error Message',
          summary: 'Employee could not be added.',
          duration: 5000
        });
      }
    );
  }
 
}







