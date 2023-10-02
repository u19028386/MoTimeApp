
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ProjectAllocationView } from 'src/app/shared/projectAllocationView';
import { EventReport } from 'src/app/shared/event-report';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as jsPDF from 'jspdf';
import { TDocumentDefinitions } from 'pdfmake/interfaces';


(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-consolidated-report',
  templateUrl: './consolidated-report.component.html',
  styleUrls: ['./consolidated-report.component.css'],
})
export class ConsolidatedProjectReportComponent implements OnInit {
  consolidatedReport: ConsolidatedReport[] = [];
  projectAllocations: ProjectAllocationView[] = [];
  eventReports: EventReport[] = [];
  isModalOpen = false;
grandTotalNumHours: number = 0;
grandTotalCapturedHours: number = 0;
grandTotalRemainingHours: number = 0;


  constructor(
    private dataService: DataService,
    private router: Router,
    private toast: NgToastService,
    private renderer: Renderer2, private el: ElementRef
  ) {(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
  }


  ngOnInit(): void {
    this.getAllocations();
    this.getEvents();
    this.openModal();
  }


  getAllocations() {
    this.dataService.getProjectAllocations().subscribe(
      (projectAllocations: ProjectAllocationView[]) => {
        this.projectAllocations = projectAllocations;
        this.consolidateReportForProjects(projectAllocations);
      }
    );
  }


  getEvents() {
    this.dataService.getEventHours().subscribe((eventReports: EventReport[]) => {
      this.eventReports = eventReports;
    });
  }


  downloadReportp(format: string) {
    if (format === 'pdf') {
      this.downloadPdfp();
    }
  }
 
downloadPdfp() {
  // Initialize an array to hold the content for the PDF
  const pdfContent: any[] = [];


  // Create a heading for the report
  const reportHeading = {
    text: 'Consolidated Project Report',
    style: 'reportHeader',
  };


  // Create the report date
  const reportDate = {
    text: 'Date: ' + new Date().toLocaleDateString(), // You can format the date as needed
    style: 'reportDate',
  };


  // Add the reportHeading and reportDate to the PDF content
  pdfContent.push(reportHeading, reportDate);


  // Create table column headers
  const columnHeaders = [
    'Employee Name',
    'Estimated Hours (h)',
    'Captured Hours (h)',
    'Remaining Hours (h)',
    'Remaining Hours (%)',
  ];


  // Iterate through the consolidatedReport
  this.consolidatedReport.forEach((report) => {
    // Create a table for each project with its name
    const projectTable = {
      table: {
        widths: ['*'],
        body: [
          [{ text: 'Project Name : ' + report.projectName, style: 'projectHeader' }],
        ],
        // Add table border
        layout: {
          hLineWidth: function (i: number, node: any) {
            return 1; // horizontal line width
          },
          vLineWidth: function (i: number, node: any) {
            return 1; // vertical line width
          },
        },
      },
      style: 'projectTable',
    };


    // Create a table for the project's employee data
    const employeeTable = {
      table: {
        headerRows: 1,
        widths: ['*', 'auto', 'auto', 'auto', 'auto'], // Adjust column widths as needed
        body: [columnHeaders], // Add column headers
        // Add table border
        layout: {
          hLineWidth: function (i: number, node: any) {
            return 1; // horizontal line width
          },
          vLineWidth: function (i: number, node: any) {
            return 1; // vertical line width
          },
        },
      },
      style: 'employeeTable',
    };


    // Iterate through the employees of the report
    report.employees?.forEach((employee) => {
      const totalNumHours = employee.totalNumHours.toString();
      const capturedHours = this.getCapturedHours(report, employee).toString();
      const remainingHours = this.getRemainingHours(report, employee).toString();
      const remainingPercentage = this.getRemainingPercentage(report, employee);


      employeeTable.table.body.push([
        `${employee.firstName} ${employee.lastName}`,
        totalNumHours,
        capturedHours,
        remainingHours,
        remainingPercentage,
      ]);
    });


    // Add the projectTable and employeeTable to the PDF content
    pdfContent.push(projectTable, employeeTable);


    // Create a subtotal row for this project
    const subtotalRow = [
      'Subtotal',
      report.totalNumHours.toString(),
      report.totalCapturedHours.toString(),
      report.remainingHours.toString(),
      ((report.remainingHours / report.totalNumHours) * 100).toFixed(2) + '%',
    ];


    // Add the subtotal row to the employeeTable
    employeeTable.table.body.push(subtotalRow);
  });


  // Create a table for the grand totals
  const grandTotalsTable = {
    table: {
      widths: ['*', 'auto', 'auto', 'auto', 'auto'], // Adjust column widths as needed
      body: [
        columnHeaders, // Add column headers
        [
          { text: 'Grand Totals', style: 'grandTotalHeader', colSpan: 5 },
          '', '', '', ''
        ],
        [
          'Grand Total',
          this.grandTotalNumHours.toString(),
          this.grandTotalCapturedHours.toString(),
          this.grandTotalRemainingHours.toString(),
          ((this.grandTotalRemainingHours / this.grandTotalNumHours) * 100).toFixed(2) + '%',
        ],
      ],
      // Add table border
      layout: {
        hLineWidth: function (i: number, node: any) {
          return 1; // horizontal line width
        },
        vLineWidth: function (i: number, node: any) {
          return 1; // vertical line width
        },
      },
    },
    style: 'grandTotalTable',
  };


  // Add the grandTotalsTable to the PDF content
  pdfContent.push(grandTotalsTable);


  // Create the PDF definition
  const pdfDefinition: TDocumentDefinitions = {
    content: pdfContent,
    styles: {
      reportHeader: {
        fontSize: 20,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10], // Add margin to separate from other content
      },
      reportDate: {
        fontSize: 12,
        alignment: 'right',
        margin: [0, 0, 0, 10], // Add margin to separate from other content
      },
      projectHeader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 10],
      },
      grandTotalHeader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 10],
      },
      projectTable: {
        margin: [0, 5, 0, 15],
      },
      employeeTable: {
        margin: [0, 0, 0, 10],
      },
      grandTotalTable: {
        margin: [0, 5, 0, 15],
      },
    },
  };


  // Generate and download the PDF
  pdfMake.createPdf(pdfDefinition).download('consolidated-report.pdf');
}


createTableContent(report: ConsolidatedReport): any[][] {
  const tableContent: any[][] = [];


  // Add a header row for the employee table
  tableContent.push([
    'Employee Name',
    'Estimated Hours (h)',
    'Captured Hours (h)',
    'Remaining Hours (h)',
    'Remaining Hours (%)',
  ]);


  // Iterate through the employees of the report
  report.employees?.forEach((employee) => {
    tableContent.push([
      `${employee.firstName} ${employee.lastName}`,
      employee.totalNumHours,
      this.getCapturedHours(report, employee),
      this.getRemainingHours(report, employee),
      this.getRemainingPercentage(report, employee),
    ]);
  });


  // Add a row for the subtotal
  tableContent.push([
    'Subtotal',
    report.totalNumHours,
    report.totalCapturedHours,
    report.remainingHours,
    ((report.remainingHours / report.totalNumHours) * 100).toFixed(2) + '%',
  ]);
  return tableContent;
}


  private extractContent(node: Node): any {
    const content: any[] = [];


    if (node.nodeType === Node.TEXT_NODE) {
      content.push({ text: node.textContent });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;


      switch (element.tagName.toLowerCase()) {
        case 'h2':
          content.push({ text: element.textContent, style: 'header' });
          break;
        case 'h3':
          content.push({ text: element.textContent, style: 'subheader' });
          break;
        // Handle other HTML elements if needed
      }
    }


    node.childNodes.forEach((childNode) => {
      const extractedContent = this.extractContent(childNode);
      if (extractedContent) {
        content.push(extractedContent);
      }
    });


    return content.length > 0 ? content : null;
  }


  openModal() {
    this.isModalOpen = true;
  }


  closeModal() {
    this.isModalOpen = false;
  }


  cancel() {
    this.router.navigate(['/project-manager']);
  }


getCapturedHours(report: ConsolidatedReport, employee: ProjectAllocationView): number {
  // Filter eventReports to get only the reports for the specific project and employee
  const projectEventReports = this.eventReports.filter(
    (eventReport) => +eventReport.project === report.projectId && +eventReport.employee === employee.employeeId
  );




  // Calculate the total captured hours for the specified project and employee
  const capturedHours = projectEventReports.reduce((total, report) => {
    const startTime = new Date(report.start);
    const endTime = new Date(report.end);


    if (!isNaN(startTime.getTime()) && !isNaN(endTime.getTime())) {
      const durationMilliseconds = endTime.getTime() - startTime.getTime();
      const durationHours = durationMilliseconds / (1000 * 60 * 60);
      return total + durationHours;
    } else {
      console.error('Invalid date object in event report:', report);
      return total;
    }
  }, 0);




  return capturedHours;
}


getRemainingHours(report: ConsolidatedReport, employee: ProjectAllocationView): number {
  // Calculate the remaining hours for the employee in the current project
  const remainingHours = employee.totalNumHours - this.getCapturedHours(report, employee);
  return remainingHours;
}


getRemainingPercentage(report: ConsolidatedReport, employee: ProjectAllocationView): string {
  // Calculate the remaining percentage for the employee in the current project
  const remainingPercentage = ((this.getRemainingHours(report, employee) / employee.totalNumHours) * 100).toFixed(2) + '%';
  return remainingPercentage;
}


consolidateReportForProjects(projectAllocations: ProjectAllocationView[]): void {
  const consolidatedReport: ConsolidatedReport[] = [];
  const uniqueProjectIds = [...new Set(projectAllocations.map((allocation) => allocation.projectId))];


  uniqueProjectIds.forEach((projectId) => {
    const projectAllocationsForProject = projectAllocations.filter(
      (allocation) => allocation.projectId === projectId
    );


    const projectName = projectAllocationsForProject[0].pName;


    // Calculate totalNumHours, remainingHours, totalCapturedHours for the project
    const {
      totalNumHoursForProject,
      remainingHours,
      totalCapturedHours,
    } = this.calculateProjectTotals(projectId, projectAllocationsForProject);


    // Create a consolidated report object for this project
    const consolidatedProjectReport: ConsolidatedReport = {
      projectId: projectId,
      projectName: projectName,
      totalNumHours: totalNumHoursForProject,
      remainingHours: remainingHours,
      totalCapturedHours: totalCapturedHours,
      employees: projectAllocationsForProject,
      enddate: new Date()
    };
    consolidatedReport.push(consolidatedProjectReport);
  });


  // Calculate Grand Totals
  const grandTotalNumHours = consolidatedReport.reduce(
    (total, report) => total + report.totalNumHours,
    0
  );
  const grandTotalCapturedHours = consolidatedReport.reduce(
    (total, report) => total + report.totalCapturedHours,
    0
  );
  const grandTotalRemainingHours = consolidatedReport.reduce(
    (total, report) => total + report.remainingHours,
    0
  );


  // Assign the consolidated report and grand totals to component properties
  this.consolidatedReport = consolidatedReport;
  this.grandTotalNumHours = grandTotalNumHours;
  this.grandTotalCapturedHours = grandTotalCapturedHours;
  this.grandTotalRemainingHours = grandTotalRemainingHours;
}


// Calculate totalNumHours, remainingHours, and totalCapturedHours for a project
calculateProjectTotals(projectId: number, projectAllocations: ProjectAllocationView[]): {
  totalNumHoursForProject: number;
  remainingHours: number;
  totalCapturedHours: number;
} {
  const projectEventReports = this.eventReports.filter(
    (report) => Number(report.project) === projectId
  );


  const totalNumHoursForProject = projectAllocations.reduce(
    (total, allocation) => total + allocation.totalNumHours,
    0
  );


  // Calculate totalCapturedHours based on event reports
  const totalCapturedHours = projectEventReports.reduce((total, report) => {
    const startTime = new Date(report.start);
    const endTime = new Date(report.end);


    if (!isNaN(startTime.getTime()) && !isNaN(endTime.getTime())) {
      const durationMilliseconds = endTime.getTime() - startTime.getTime();
      const durationHours = durationMilliseconds / (1000 * 60 * 60);
      return total + durationHours;
    } else {
      console.error('Invalid date object in event report:', report);
      return total;
    }
  }, 0);


  // Calculate totalHoursSpent based on projectAllocations
  const totalHoursSpent = projectAllocations.reduce((total, allocation) => {
    const consolidatedReport: ConsolidatedReport = {
      projectId: projectId,
      projectName: allocation.pName,
      totalNumHours: allocation.totalNumHours,
      remainingHours: 0, // You may update this as needed
      totalCapturedHours: 0, // You may update this as needed
      employees: [], // You may update this as needed
      enddate: new Date(),
    };
    const capturedHours = this.getCapturedHours(consolidatedReport, allocation);
    return total + capturedHours;
  }, 0);


  const remainingHours = totalNumHoursForProject - totalHoursSpent;


  return {
    totalNumHoursForProject: totalNumHoursForProject,
    remainingHours: remainingHours,
    totalCapturedHours: totalCapturedHours,
  };
}
}


interface ConsolidatedReport {
  projectId: number;
  projectName: string;
  totalNumHours: number;
  remainingHours: number;
  totalCapturedHours: number;
  employees?: ProjectAllocationView[];
  enddate: Date;
}


