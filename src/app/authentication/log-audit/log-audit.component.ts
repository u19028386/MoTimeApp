import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { UserStoreService } from 'src/app/user-store.service';

@Component({
  selector: 'app-log-audit',
  templateUrl: './log-audit.component.html',
  styleUrls: ['./log-audit.component.css']
})
export class LogAuditComponent implements OnInit{
  public action: string = "";
  public fullName: string = "";

  constructor(private apiService: APIService, private userStore: UserStoreService,) {}

  ngOnInit() {
    this.userStore.getFullName()
  .subscribe(val => {
    const fullNameFromToken = this.apiService.getNameFromToken();
    this.fullName = (val || fullNameFromToken) as string;
  });

  }

  // performAction(action: string) {
  //   this.action = action;

  //   // Log the action
  //   this.apiService.logAudit(this.action, this.fullName).subscribe(
  //     () => {
  //       console.log('Action logged successfully');
  //     },
  //     (error) => {
  //       console.error('Error logging action:', error);
  //     }
  //   );
  // }

}
