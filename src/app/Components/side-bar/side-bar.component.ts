import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from 'src/app/services/api.service';
import { UserStoreService } from 'src/app/user-store.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  public fullName: string = "";
  user: any = {};
  public role!:string;
  public userId!: string;
  isSidebarCollapsed: boolean = false;
  CurrentUser: number = 0;
  constructor(private apiService: APIService, private userStore: UserStoreService, private router: Router, private route: ActivatedRoute){}

  ngOnInit() {
    const user = localStorage.getItem('CurrentUser');
   
    if(user != null)
    {
      this.CurrentUser = parseInt(user);
    }

    this.userStore.getFullName()
  .subscribe(val => {
    const fullNameFromToken = this.apiService.getNameFromToken();
    this.fullName = (val || fullNameFromToken) as string;
});

    this.userStore.getRole()
    .subscribe(val=>{
      const roleFromToken = this.apiService.getRoleFromToken();
      this.role = (val || roleFromToken) as string
    });

    this.userStore.getUserId()
    .subscribe(val=>{
      const idFromToken = this.apiService.getUserIdFromToken();
      this.userId = (val || idFromToken) as string
    });
  }
  logOut()
  {
    this.apiService.logOut();
  }
  goToProfile(): void {
    this.router.navigate(['profile', this.CurrentUser]);
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

}
