import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
import { ProjectAllocationView } from 'src/app/shared/projectAllocationView';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs; // Set fonts for pdfMake

interface TableData {
  projectName: string;
  firstName: string;
  lastName: string;
  totalNumHours: number;
}

@Component({
  selector: 'app-team-hours-report',
  templateUrl: './team-hours-report.component.html',
  styleUrls: ['./team-hours-report.component.css']
})
export class TeamHoursReportComponent implements OnInit {
  allocations: ProjectAllocationView[] = [];
  groupedAllocations: Map<string, ProjectAllocationView[]> = new Map();
  projectTotalHours: Map<string, number> = new Map();

  constructor(private apiService: APIService, private dataService: DataService) {}

  ngOnInit(): void {
    this.getAllocations();
  }

  getAllocations() {
    this.dataService.getProjectAllocations().subscribe((projectAllocations: ProjectAllocationView[]) => {
      this.allocations = projectAllocations;
      this.groupAllocationsByPName();
    });
  }

  groupAllocationsByPName() {
    this.groupedAllocations.clear();

    this.allocations.forEach((allocation) => {
      if (allocation.pName) {
        if (this.groupedAllocations.has(allocation.pName)) {
          this.groupedAllocations.get(allocation.pName)?.push(allocation);
        } else {
          this.groupedAllocations.set(allocation.pName, [allocation]);
        }
      }
    });

    // Calculate and store total hours for each project
    this.calculateTotalHoursForProjects();
  }

  calculateTotalHoursForProjects() {
    this.projectTotalHours.clear();

    this.groupedAllocations.forEach((allocations, projectName) => {
      const totalHours = allocations.reduce((total, allocation) => total + allocation.totalNumHours, 0);
      this.projectTotalHours.set(projectName, totalHours);
    });
  }

  downloadPdfp() {
    const docDefinition = {
      content: [
        { text: 'Team Hours Report', style: 'header' },
        { text: 'Generated on: ' + new Date().toLocaleDateString() },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*'],
            body: [
              [
                'Project Name',
                'First Name',
                'Last Name',
                'Total Hours',
              ],
              ...this.getPDFData().map((row) => Object.values(row)), // Extract values from TableData
            ],
          },
          layout: 'headerLineOnly',
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true, marginBottom: 10 },
      },
    };
  
    pdfMake.createPdf(docDefinition).download('team_hours_report.pdf');
  }
  

  getPDFData(): TableData[] {
    const data: TableData[] = [];
    this.groupedAllocations.forEach((allocations, projectName) => {
      allocations.forEach((allocation) => {
        data.push({
          projectName,
          firstName: allocation.firstName,
          lastName: allocation.lastName,
          totalNumHours: allocation.totalNumHours,
        });
      });
      data.push({
        projectName: 'Total',
        firstName: '',
        lastName: '',
        totalNumHours: this.projectTotalHours.get(projectName) || 0,
      });
    });
    return data;
  }
}
