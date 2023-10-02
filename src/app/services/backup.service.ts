import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BackupandRestoreService {
  private apiUrl = 'https://localhost:7153/api/BackupandRestore';


  constructor(private http: HttpClient) { }

  backupDatabase(): Observable<string> {
    return this.http.post(`${this.apiUrl}/backup`, null, { responseType: 'text' });
  }


  restoreDatabase(formData: FormData): Observable<string> {
    return this.http.post(`${this.apiUrl}/restore`, formData, { responseType: 'text' });
  }
 
}
