export interface ProjectAllocationView {

  projectAllocationId: number;
  employeeId : number;
  projectId: number;


  isEligibleToClaim : boolean;
  claimableAmount : number;
  totalNumHours : number;
  billableOverTime : number;
  isOperationalManager : boolean;
  isProjectManager : boolean;
  pName : string;
  claim : string;
  firstName : string;
  lastName  : string;
  enddate : Date ;
  userId: number;
  }


