import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { DataService } from 'src/app/services/data.service';
import { MaxHour } from 'src/app/shared/maxHours';

@Component({
  selector: 'app-max-hours',
  templateUrl: './max-hours.component.html',
  styleUrls: ['./max-hours.component.css']
})
export class MaxHoursComponent {
  maximums: MaxHour[] = [];


  constructor(private dataService: DataService, private toast: NgToastService,
    private router: Router) {}


  ngOnInit(): void {
    this.getMaximums();
    const CurrentRole = localStorage.getItem('CurrentRole');
    if(CurrentRole != "Administrator")
    {
      this.router.navigate(['unauthorised']);
    }
  }


  getMaximums() {
    this.dataService.getMaximums().subscribe((result: MaxHour[]) => {
      this.maximums = result;
    });
  }
}

