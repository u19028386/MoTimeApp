export interface ProjectRequestViewModel {
    projectRequestId: number;
    projectRequestStatusId: number;
    projectRequestDescription: string;
    projectRequestDate: Date;
    employeeId: number;

}
    
    
    
    export class ProjectReqViewModel {
      id: number;
      employeeId: number;
      projectRequestDescription: string;
      projectRequestDate: Date;
    
      constructor(
        id: number,
        employeeId: number,
        projectRequestDescription: string,
        projectRequestDate: Date
      ) {
        this.id = id;
        this.employeeId = employeeId;
        this.projectRequestDescription = projectRequestDescription;
        this.projectRequestDate = projectRequestDate;
      }
    }
  