import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectAllocationView } from '../shared/projectAllocationView';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
 
  private baseUrl = 'https://localhost:7153/api/';


  constructor(private http: HttpClient) { }


  getProjectAllocationsForEmployee(employeeId: number): Observable<ProjectAllocationView[]> {
    const url = `${this.baseUrl}MoTime/GetProjectAllocationsForEmployee/${employeeId}`;
    return this.http.get<ProjectAllocationView[]>(url);
  }
}
