import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ProjectAllocationView } from 'src/app/shared/projectAllocationView';

@Component({
  selector: 'app-p-graph',
  templateUrl: './p-graph.component.html',
  styleUrls: ['./p-graph.component.css']
})
export class PGraphComponent {
  projectAllocations: ProjectAllocationView[] = [];


  projectNames: string[] = [];
  totalNumHours: number[] = [];
  billableOverTime: number[] = [];


  constructor(private dataService: DataService) {}
   
    ngOnInit(): void {
      this.getProjectAllocations();
      console.log('h');
   
    }
    getProjectAllocations() {
      this.dataService.getProjectAllocations().subscribe((result: ProjectAllocationView[]) => {
        this.projectAllocations = result;
 
        this.projectAllocations.forEach((allocation) => {
          this.projectNames.push(allocation.pName);
          this.totalNumHours.push(allocation.totalNumHours);
          this.billableOverTime.push(allocation.billableOverTime);
        });
      });
    }

}
