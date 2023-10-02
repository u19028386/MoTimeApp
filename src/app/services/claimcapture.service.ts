import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ClaimCapture } from '../shared/claimCapture';
import { Employee } from '../shared/emp';
import { Project } from '../shared/pProject';
import { ProjectAllocation } from '../shared/pAllocation';
import { ClaimCaptureview } from '../shared/claimCaptureView';
import { Eemployee } from '../shared/eemployee';


@Injectable({
  providedIn: 'root'
})
export class ClaimcaptureService {
  apiUrl = 'https://localhost:7153/api/';


  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };


  constructor(private httpClient: HttpClient) { }


  getAllProjects(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}MoTime/GetAllProjects`)
      .pipe(map(result => result))
 
  }
  getProject(projectId: number): Observable<Project> {
    return this.httpClient.get<Project>(`${this.apiUrl}MoTime/GetProject/${projectId}`);
  }


  AcceptOrReject(claim: number, status: number):  Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}MoTime/AcceptOrReject/${claim}/${status}`);
  }
 
  getAllEmployees(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}MoTime/GetEmployeeClaimCapture`)
      .pipe(map(result => result))
 
  }
  getEmployee(employeeId: number): Observable<Eemployee> {
    return this.httpClient.get<Eemployee>(`${this.apiUrl}MoTime/GetEmployee/${employeeId}`);
  }




  getAllAllocations(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}MoTime/GetAllProjectAllocations`)
      .pipe(map(result => result))
 
  }




  getAllClaimItems(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}MoTime/GetAllClaimItems`)
      .pipe(map(result => result))
 
  }




  getAllClaimCaptures(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}MoTime/GetAllClaimCaptures`)
      .pipe(map(result => result))
 
  }
  getClaimCapture(claimId: number): Observable<ClaimCapture> {
    return this.httpClient.get<ClaimCapture>(`${this.apiUrl}MoTime/GetClaimCapture/${claimId}`);
  }


 
  addClaimCapture(claimCapture: FormData): Observable<ClaimCapture> {
    return this.httpClient.post<ClaimCapture>(`${this.apiUrl}MoTime/addClaimCapture`, claimCapture);
  }


  updateClaimCapture(claimCapture: FormData, claimId: number): Observable<any> {
   
   // const body = {
    //  id: claimCapture.id,
    //  amount: claimCapture.amount,
    //  Date : claimCapture.Date,
    //  ProjectAllocationId  :
    //  claimCapture.ProjectAllocationId ,  
   //   ProofName: claimCapture.ProofName,
   //   UploadProof: claimCapture.UploadProof };


   // console.log(body);
    return this.httpClient.post<void>(`https://localhost:7153/api/MoTime/EditClaimCapture/${claimId}`, claimCapture);
  }
 


  deleteClaimCapture( claimId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}MoTime/DeleteClaimCapture/${ claimId}`, this.httpOptions);
  }


  downloadClaimProof(claimId: number): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}MoTime/DownloadClaimProof/${claimId}`, {
      responseType: 'blob' as 'json' // Set response type to blob
    });
  }


  // Add this method to view a claim document
  viewClaimDocument(claimId: number): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}MoTime/ViewClaimDocument/${claimId}`, {
      responseType: 'blob' as 'json' // Set response type to blob
    });
  }
  // Get all claim capture statuses
getAllClaimCaptureStatuses(): Observable<any> {
  return this.httpClient.get(`${this.apiUrl}MoTime/GetAllCliamCaptureStatuses`)
    .pipe(map(result => result));
}


// Get a single claim capture status by ID
getClaimCaptureStatusById(id: number): Observable<any> {
  return this.httpClient.get(`${this.apiUrl}MoTime/GetClaimCaptureStatusById/${id}`)
    .pipe(map(result => result));
}


submitClaimCapture(claimId: number): Observable<any> {
  return this.httpClient.post<any>(`${this.apiUrl}MoTime/SubmitClaimCapture`, claimId);
}



}
