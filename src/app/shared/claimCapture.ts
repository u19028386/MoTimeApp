export interface ClaimCapture {
  claimId: number;
  amount: number;
  date: Date;
  uploadProof: File |null;
  projectAllocationId: number;
  proofName:string;
  claimStatusId: number;
}



export class ClaimCaptureViewModel {
  id: number;
  ProjectAllocationId: number;
  Amount: number;
  UploadProof: File;
  Date: Date;
  ProofName: string;

  constructor(
    id: number,
    projectAllocationId: number,
    amount: number,
    uploadProof: File,
    date: Date,
    proofName: string
  ) {
    this.id = id;
    this.ProjectAllocationId = projectAllocationId;
    this.Amount = amount;
    this.UploadProof = uploadProof;
    this.Date = date;
    this.ProofName = proofName;
  }
}
