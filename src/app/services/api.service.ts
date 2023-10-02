import { Injectable } from '@angular/core';
import { Observable, map, of} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RegisterUser } from '../shared/register-user';
import { LoginUser } from '../shared/login-user';
import { UserDetails } from '../shared/user-details';
import { ForgotPassword } from '../shared/forgot-password';
import { Router } from '@angular/router';
import { User } from '../shared/user';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import * as jwt_decode from 'jwt-decode';
import jwtDecode from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TitleModel } from 'src/app/shared/title';
import { RoleModel } from 'src/app/shared/role';
import { ProjectRequestViewModel } from '../shared/projectRequest';

import { EmployeeHoursData } from '../shared/employeeHours';
import { Eemployee } from '../shared/eemployee';
import { AuthService } from './auth.service';
import { Task } from '../shared/task';
import { TaskStatus } from '../shared/taskStatus';
import { TaskPriority } from '../shared/taskProirity';
import { TaskType } from '../shared/taskType';
import { ITDepartment } from '../shared/it-department';
import { AuditLog } from '../shared/auditLog';
import { PermissionModel } from '../shared/permissions';
import { UserRolePermissionModel } from '../shared/rolePermission';



@Injectable({
  providedIn: 'root'
})

export class APIService {
  private currentUser: User | undefined;
  private loggedIn: boolean = false;
  private loggedInUserId: number | null = null;
  
  private userRoleSubject = new BehaviorSubject<string[]>([]);
  userRole$ = this.userRoleSubject.asObservable();
  private userPayload: any;

apiUrl = 'https://localhost:7153/api/'

httpOptions ={
  headers: new HttpHeaders({
    ContentType: 'application/json'
  })
}

  constructor(private httpClient: HttpClient, private router: Router, private authService: AuthService) {
    this.userPayload = this.decodeJwtToken();
  }
  login(userId: number) {
    this.loggedIn = true;
    this.loggedInUserId = userId;
  }
  getTitles(): Observable<TitleModel[]> {
    return this.httpClient.get<TitleModel[]>(`${this.apiUrl}Authentication/GetAllTitles`);
  }

  getUserRoles(): Observable<RoleModel[]> {
    return this.httpClient.get<RoleModel[]>(`${this.apiUrl}Authentication/GetAllUserRoles`);
  }
  Register(user:any)
  {
    return this.httpClient.post<any>(`${this.apiUrl}Authentication/Register`, user)
  }
  Login(user:any)
  {
    return this.httpClient.post<any>(`${this.apiUrl}Authentication/Login`, user)
  }
  ForgotPassword(emailAddress: string) {
    return this.httpClient.post(`${this.apiUrl}Authentication/ForgotPassword`, emailAddress , {...this.httpOptions, responseType: 'text'})
    .pipe(
      catchError((error) => {
        console.error('Error occurred while registering user:', error);
        // Handle the error as per your application's requirements
        // Return an observable or throw an error to be handled by the caller
        return throwError('Failed to register user. Please try again later.');
      })
    );
  }

  forgotPassword(payload: any) {
    return this.httpClient.post(`${this.apiUrl}Authentication/ForgotPassword`, payload, {...this.httpOptions, responseType: 'text'})
    .pipe(
      catchError((error) => {
        console.error('Error occurred while registering user:', error);
        // Handle the error as per your application's requirements
        // Return an observable or throw an error to be handled by the caller
        return throwError('Failed to register user. Please try again later.');
      }));
  }

  updatePassword(userId: number, newPassword: string): Observable<any> {
    const url = `${this.apiUrl}Authentication/UpdatePassword/${userId}`;
    const requestBody = { NewPassword: newPassword };
    return this.httpClient.put(url, requestBody);
  }
  setCurrentUser(user: User) {
    this.currentUser = user;
  }

  getUserEmail(email: string): Observable<string | undefined> {
    const apiUrl = `http://localhost:5240/api/Authentication/ViewUserDetails/${email}`;
    const mediaType = 'application/json';
  
    // Set the request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': mediaType
      })
    };
  
    return this.httpClient.get<string>(apiUrl, httpOptions);
  }
  IsLoggedIn()
  {
    return !!localStorage.getItem('token');
  }
  setUserRole(userRole: string[]) {
    this.userRoleSubject.next(userRole);
  }

  clearUserRole() {
    this.userRoleSubject.next([]);
  }
  logOut()
  {
    localStorage.clear();
    this.router.navigate(['login']);
  }
  storeToken(tokenValue: string)
  {
    localStorage.setItem('token', tokenValue);
  }
  getToken()
  {
    return localStorage.getItem('token');
  }
  isLoggedIn(): boolean{
    return !!localStorage.getItem('token');
  }
  decodeJwtToken() {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    console.log(jwtHelper.decodeToken(token))
    return jwtHelper.decodeToken(token);
  } 
  getFullNameFromToken()
  {
    if(this.userPayload)
    {
      return this.userPayload.name;
    }
  } 
  getRoleFromToken(): string | undefined {
    if (this.userPayload && this.userPayload.role) {
      return this.userPayload.role;
    } else {
      // Handle the case where role is missing or undefined
      return undefined;
    }
  }
  getUserIdFromToken(): string | undefined {
    if (this.userPayload && this.userPayload.userId) {
      return this.userPayload.userId;
    } else {
      // Handle the case where role is missing or undefined
      return undefined;
    }
  }
  getNameFromToken(): string | undefined {
    if (this.userPayload && this.userPayload.unique_name) {
      return this.userPayload.unique_name;
    } else {
      // Handle the case where role is missing or undefined
      return undefined;
    }
  }
  getAllUsers(): Observable<any[]> {
    return this.httpClient.get<any>(`${this.apiUrl}Authentication/GetAllUsers`);
  }
  getUser(userId: number): Observable<User> {
    return this.httpClient.get<User>(`${this.apiUrl}Authentication/GetUser/${userId}`);
  }
  updateUser(userId: number, user: FormData): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}Authentication/UpdateUser/${userId}`, user);
  }
  deactivateUser(userId: number): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}Authentication/DeactivateAccount/${userId}`, {});
  }
  getUserDetails(userId: number): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Authentication/ViewAccount/${userId}`);
  }

  getProfilePictureUrl(userId: number): Observable<Blob> {
    // Replace 'your-endpoint-for-profile-picture' with the actual endpoint in your API
    const endpoint = `${this.apiUrl}Authentication/profile-picture/${userId}`;

    // Set the responseType to 'blob' to handle binary data (profile picture)
    return this.httpClient.get(endpoint, { responseType: 'blob' });
  }
  // getUserDetails(UserId: number): Observable<any> {
  //   return this.httpClient.get(`${this.apiUrl}Authentication/ViewAccount/${UserId}`);
  // } 
  logout() {
    this.loggedIn = false;
    this.loggedInUserId = null;
  }

  getLoggedInUserId(): number | null {
    return this.loggedInUserId;
  }

  isLoggedInUser(): boolean {
    return this.loggedIn;
  }


  //////////////////////////////////////////////ROLES////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////
  
  // Get role by id
  GetRole(userRoleId: number): Observable<RoleModel> {
    return this.httpClient.get<RoleModel>(`${this.apiUrl}Authentication/GetUserRole/${userRoleId}`);
  }
  
  
  // Add role
  AddUserRole(userRoleId: RoleModel): Observable<RoleModel> {
    return this.httpClient.post<RoleModel>(`${this.apiUrl}Authentication/AddUserRole`, userRoleId, this.httpOptions);
  }
  
  
  // Edit role
  EditUserRole(userRoleId: number, role: RoleModel): Observable<RoleModel> {
    return this.httpClient.put<RoleModel>(`${this.apiUrl}Authentication/EditUserRole/${userRoleId}`, role, this.httpOptions);
  }
  
  
  // Delete role
  DeleteUserRole(userRoleId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}Authentication/DeleteUserRole/${userRoleId}`, this.httpOptions);
  }

  //////////////////////////////////////////////Reports////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////
  getControlBreakReport(selectedProjectName: string): Observable<any[]> {
    const url = `${this.apiUrl}MoTime/GetControlBreakReport/${selectedProjectName}`;
    return this.httpClient.get<any[]>(url);
  }

  getProjectTeams() {
    return this.httpClient.get(`${this.apiUrl}MoTime/projectteams`);
  }
  getProjectTotalHours(projectId: number): Observable<number> {
    return this.httpClient.get<number>(`${this.apiUrl}MoTime/GetProjectTotalHours?projectId=${projectId}`);
  }
  getEmployeeHoursPerProject(projectId: number): Observable<EmployeeHoursData[]> {
    const url = `${this.apiUrl}MoTime/GetEmployeeHoursPerProject?projectId=${projectId}`;
    return this.httpClient.get<EmployeeHoursData[]>(url);
  }

  getEmployeeName(employeeId: number): Observable<string> {
    // Implement the logic to fetch employee name based on employeeId
    return this.httpClient.get<string>(`${this.apiUrl}MoTime/GetEmployeeName/${employeeId}`);
  }

  getEmployeeById(employeeId: number): Observable<Eemployee> {
    return this.httpClient.get<Eemployee>(`${this.apiUrl}MoTime/GetEmployee/${employeeId}`);
  }
  getAllProjects(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}MoTime/GetAllProjects`);
  }
  ////////////////////////////////////////Project Request //////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  logProjectRequest(request: any): Observable<any> {
    return this.httpClient.post<ProjectRequestViewModel>(`${this.apiUrl}MoTime/AddProjectRequest`, request);
  }
  getAllProjectRequests(): Observable<any> {
    return this.httpClient.get<ProjectRequestViewModel[]>(`${this.apiUrl}MoTime/GetAllProjectRequests`);
  }

  getProjectRequest(id: number): Observable<ProjectRequestViewModel[]> {
    return this.httpClient.get<ProjectRequestViewModel[]>(`${this.apiUrl}MoTime/GetProjectRequest/${id}`);
  }
  getAllProjectRequestStatuses(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}MoTime/GetAllProjectRequestStatus`);
  }

  getProjectRequestStatus(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}MoTime/GetProjectStatusById/${id}`);
  }
  AcceptOrReject(request: number, status: number):  Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}MoTime/AcceptOrRejectProjectRequest/${request}/${status}`);
  }
  getAllEmployees(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}MoTime/GetEmployeeClaimCapture`)
      .pipe(map(result => result))
 
  }
  getEmployee(employeeId: number): Observable<Eemployee> {
    return this.httpClient.get<Eemployee>(`${this.apiUrl}MoTime/GetEmployee/${employeeId}`);
  }
  submitProjectRequest(requestId: number): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}MoTime/SubmitProjectRequest`, requestId);
  }
  /////////////////////////////////// Tasks //////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  getAllTaskStatuses(): Observable<any> {
    return this.httpClient.get<TaskStatus[]>(`${this.apiUrl}MoTime/GetAllTaskStatuses`);
  }
  getTaskStatusById(id: number): Observable<any> {
    return this.httpClient.get<TaskStatus>(`${this.apiUrl}MoTime/GetTaskStatusById/${id}`);
  }
  getAllTaskPriorities(): Observable<any> {
    return this.httpClient.get<TaskPriority[]>(`${this.apiUrl}MoTime/GetAllTaskPriorities`);
  }

  getTaskPriorityById(id: number): Observable<any> {
    return this.httpClient.get<TaskPriority>(`${this.apiUrl}MoTime/GetTaskPriorityById/${id}`);
  }

  getAllTaskTypes(): Observable<any> {
    return this.httpClient.get<TaskType[]>(`${this.apiUrl}MoTime/GetAllTaskTypes`);
  }

  getTaskTypeById(id: number): Observable<any> {
    return this.httpClient.get<TaskType>(`${this.apiUrl}MoTime/GetTaskTypeById/${id}`);
  }

  getAllTasks(): Observable<any> {
    return this.httpClient.get<Task[]>(`${this.apiUrl}MoTime/GetAllTasks`);
  }

  getTaskById(id: number): Observable<any> {
    return this.httpClient.get<Task>(`${this.apiUrl}MoTime/GetTaskById/${id}`);
  }

  addTask(task: any): Observable<any> {
    return this.httpClient.post<Task>(`${this.apiUrl}MoTime/AddTask`, task);
  }

  editTask(id: number, task: any): Observable<any> {
    return this.httpClient.put<Task>(`${this.apiUrl}MoTime/EditTask/${id}`, task);
  }

  deleteTask(id: number): Observable<any> {
    return this.httpClient.delete<void>(`${this.apiUrl}MoTime/DeleteTask/${id}`);
  }

  getEmployeeByUserId(userId: number): Observable<any> {
    const url = `${this.apiUrl}Authentication/byUserId/${userId}`;
    return this.httpClient.get(url);
  }

  GetITDepartment(): Observable<ITDepartment[]> {
    return this.httpClient.get<ITDepartment[]>(`${this.apiUrl}MoTime/GetITDepartment`);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////// UPLOAD CLIENTS //////////////////////////////////////////////////////////////////////////
  uploadClients(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.httpClient.post(`${this.apiUrl}MoTime/UploadClients`, formData);
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////// AUDIT TRAIL /////////////////////////////////////////////////////////////////////////////
  logAudit(auditLog: AuditLog): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}Authentication/log`, auditLog);
  }

  getAllAuditLogs(): Observable<AuditLog[]> {
    return this.httpClient.get<AuditLog[]>(`${this.apiUrl}Authentication/GetAuditTrail`);
  }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// USER ROLE PERMISSIONS //////////////////////////////////////////////////////////////////////
addUserRolePermission(userRoleId: number, permissionIds: number[]): Observable<any> {
  const url = `${this.apiUrl}Authentication/AddUserRolePermission/${userRoleId}`;
  return this.httpClient.post(url, permissionIds);
}

updateUserRolePermission(userRoleId: number, permissionIds: number[]): Observable<any> {
  const url = `${this.apiUrl}Authentication/UpdateUserRolePermission/${userRoleId}`;
  return this.httpClient.put(url, permissionIds);
}
getAllUserRolePermissions(): Observable<any> {
  const url = `${this.apiUrl}Authentication/GetAllUserRolePermissions`;
  return this.httpClient.get(url);
}
getPermissions(): Observable<PermissionModel[]> {
  return this.httpClient.get<PermissionModel[]>(`${this.apiUrl}Authentication/GetAllPermissions`);
}
getUserRolePermission(userRoleId: number): Observable<UserRolePermissionModel> {
  return this.httpClient.get<UserRolePermissionModel>(`${this.apiUrl}Authentication/GetUserRolePermission/${userRoleId}`);
}

}
