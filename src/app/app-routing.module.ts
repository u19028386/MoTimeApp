import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component'
import { RegisterComponent } from './authentication/register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { AuthGuard } from 'src/app/gards/auth.guard';
import { ConsultantComponent } from './consultant/consultant.component';
import { ResetPasswordComponent } from './Components/reset-password/reset-password.component';
import { CalendarComponent } from './Components/calendar/calendar.component';
import { EmployeeTypeComponent } from 'src/app/Components/employee-type/employee-type.component';
import { AddEmployeeTypeComponent } from 'src/app/Components/employee-type/add-employee-type/add-employee-type.component';
import { EditEmployeeTypeComponent } from 'src/app/Components/employee-type/edit-employee-type/edit-employee-type.component';
import { EmployeeComponent } from './Components/employee/employee.component';
import { ConfigurationComponent } from 'src/app/Components/configuration/configuration.component';
import { AddEmployeeComponent } from 'src/app/Components/employee/add-employee/add-employee.component';
// import { EditEmployeeComponent } from 'src/app/Components/calendar/edit-employee/edit-employee.component';
import { AddCalendarComponent } from './Components/calendar/add-calendar/add-calendar.component';
import { EditCalendarComponent } from './Components/calendar/edit-calendar/edit-calendar.component';
import { ResetComponent } from './authentication/reset/reset.component';
import { ClientComponent } from './Components/client/client.component';
import { AddClientComponent } from './Components/client/add-client/add-client.component';
import { EmailUserComponent } from './Components/email-user/email-user.component';
import { GHelpComponent } from './Components/g-help/g-help.component';
import { AddHelpComponent } from './Components/g-help/add-help/add-help.component';
import { EditHelpComponent } from './Components/g-help/edit-help/edit-help.component';
import { HelpTypeComponent } from './Components/help-type/help-type.component';
import { AddHelpTypeComponent } from './Components/help-type/add-help-type/add-help-type.component';
import { EditHelpTypeComponent } from './Components/help-type/edit-help-type/edit-help-type.component';
import { UserHelpComponent } from './Components/user-help/user-help.component';
import { ResourceComponent } from './Components/resource/resourceview/resource.component';
import { ResourceTypeComponent } from './Components/resource/resource-type/resource-type.component';
import { AddResourceTypeComponent } from './Components/resource/resource-type/add-resource-type/add-resource-type.component';
import { EditResourceTypeComponent } from './Components/resource/resource-type/edit-resource-type/edit-resource-type.component';
import { RolesComponent } from './Components/roles/roles.component';
import { AddRolesComponent } from './Components/roles/add-roles/add-roles.component';
import { EditRoleComponent } from './Components/roles/edit-role/edit-role.component';
import { TasksComponent } from './Components/tasks/tasks.component';
import { AddTaskComponent } from './Components/tasks/add-task/add-task.component';
import { EditTaskComponent } from './Components/tasks/edit-task/edit-task.component';
import { TimesheetetComponent } from './timesheetet/timesheetet.component';
import { ViewemployeeComponent } from './Components/employee/view-employee/view-employee.component';
import { UserUpdateComponent } from './authentication/user-update/user-update.component';
import { UpdatePasswordComponent } from './authentication/update-password/update-password.component';
import { ProfileComponent } from './authentication/profile/profile.component';
import { AdministratorComponent } from './Components/administrator/administrator.component';
import { OperationsManagerComponent } from './Components/operations-manager/operations-manager.component';
import { ProjectManagerComponent } from './Components/project-manager/project-manager.component';
import { TeamHoursReportComponent } from './Components/team-hours-report/team-hours-report.component';
import { LogProjectRequestComponent } from './Components/log-project-request/log-project-request.component';
import { ProjectProgressComponent } from './Components/project-progress/project-progress.component';
import { ProjectComponent } from './Components/project/project.component';
import { AddProjectComponent } from './Components/project/add-project.component';
import { EditProjectComponent } from './Components/project/edit-project.component';
import { EditClientComponent } from './Components/client/edit-client.component';
import { AddProjectAllocationComponent } from './projectallocation/add-projectallocation.component';
import { ProjectAllocationComponent } from './projectallocation/projectallocation.component';
import { ReportsComponent } from './reports/reports.component';
import { UsersComponent } from './Components/users/users.component';
import { ProjectRequestsComponent } from './Components/project-requests/project-requests.component';
import { SideBarComponent } from './Components/side-bar/side-bar.component';
import { ConfirmationDialogComponent } from './Components/confirmation-dialog/confirmation-dialog.component';
import { VideoPlayerComponent } from './Components/video-player/video-player.component';
import { ClaimItemComponent } from './Components/claim-item/claim-item.component';
import { AddClaimTypeComponent } from './Components/claim-type/add-claim-type/add-claim-type.component';
import { EditClaimTypeComponent } from './Components/claim-type/edit-claim-type/edit-claim-type.component';
import { EditClaimItemComponent } from './Components/claim-item/edit-claim-item/edit-claim-item.component';
import { ClaimTypeComponent } from './Components/claim-type/claim-type.component';
import { AddClaimItemComponent } from './Components/claim-item/add-claim-item/add-claim-item.component';
import { EditEmployeeComponent } from './Components/employee/edit-employee/edit-employee.component';
import { AddResourceComponent } from './Components/resource/add-resource/add-resource.component';
import { EditResourceComponent } from './Components/resource/edit-resource/edit-resource.component';
import { ClientUploadComponent } from './Components/client-upload/client-upload.component';
import { TimeSheetApprovalComponent } from './time-sheet-approval/time-sheet-approval.component';
import { ClaimCaptureComponent } from './claim-capture/claim-capture.component';
import { ClientReportComponent } from './Components/client-report/client-report.component';
import { ConsolidatedProjectReportComponent } from './Components/consolidated-report/consolidated-report.component';
import { EmployeeReportComponent } from './Components/employee-report/employee-report.component';
import { ProjectReportComponent } from './Components/project-report/project-report.component';
import { ChatRoomComponent } from './Components/chat-room/chat-room.component';
import { AuditLogComponent } from './authentication/audit-log/audit-log.component';
import { LogAuditComponent } from './authentication/log-audit/log-audit.component';
import { BackupAndRestoreComponent } from './Components/backup-and-restore/backup-and-restore.component';
import { PdfPreviewComponent } from './Components/pdf-preview/pdf-preview.component';
import { UnauthorisedAccessComponent } from './unauthorised-access/unauthorised-access.component';
import { ChatBotComponent } from './authentication/chat-bot/chat-bot.component';
import { MaxHoursComponent } from './Components/max-hours/max-hours.component';
import { EditMaxHoursComponent } from './Components/max-hours/edit-max-hours/edit-max-hours.component';
import { AddClaimCaptureComponent } from './claim-capture/add-claim-capture/add-claim-capture.component';
import { EditClaimCaptureComponent } from './claim-capture/edit-claim-capture/edit-claim-capture.component';
import { TimecardHelpComponent } from './Components/timecard-help/timecard-help.component';
import { SubmittedclaimComponent } from './claim-capture/submittedclaim/submittedclaim.component';
import { QuestionsComponent } from './Components/questions/questions.component';


const routes: Routes = [
  {path: 'login', component:LoginComponent},
  {path: 'register', component:RegisterComponent},
  { path: 'reset-password', component: ResetPasswordComponent,canActivate:[AuthGuard]},
  { path: 'forgot-password', component: ForgotPasswordComponent ,canActivate:[AuthGuard]},
  { path: 'update-user/:id', component: UserUpdateComponent ,canActivate:[AuthGuard]},
  {path: 'users', component: UsersComponent,canActivate:[AuthGuard]},
  { path: 'user-details', component: UserDetailsComponent ,canActivate:[AuthGuard]},
  { path: 'update-password/:id', component: UpdatePasswordComponent ,canActivate:[AuthGuard]},
  { path: 'profile/:userId', component: ProfileComponent ,canActivate:[AuthGuard]},
  { path: 'consultant', component: ConsultantComponent,canActivate:[AuthGuard] },
  { path: 'admin', component: AdministratorComponent, canActivate:[AuthGuard]},
  { path: 'operations-manager', component: OperationsManagerComponent, canActivate:[AuthGuard] },
  { path: 'project-manager', component: ProjectManagerComponent,canActivate:[AuthGuard] },
  { path : 'mycalendar', component: CalendarComponent ,canActivate:[AuthGuard]},
  {path: 'sidebar', component: SideBarComponent,canActivate:[AuthGuard]},
  {path: 'client-upload', component: ClientUploadComponent,canActivate:[AuthGuard]},
  { path : 'employee-types', component:EmployeeTypeComponent,canActivate:[AuthGuard]},
  {path : 'addemployeetype', component:AddEmployeeTypeComponent,canActivate:[AuthGuard]},
  {path : 'editemployeetype/:id', component:EditEmployeeTypeComponent,canActivate:[AuthGuard]},
  {path : 'employees', component:EmployeeComponent,canActivate:[AuthGuard]},
  {path : 'employee/:employeeId', component:ViewemployeeComponent ,canActivate:[AuthGuard]},
  {path : 'config', component:ConfigurationComponent,canActivate:[AuthGuard]},
  {path : 'addemployee', component : AddEmployeeComponent,canActivate:[AuthGuard]},
  {path : 'eemployee/:id', component:EditEmployeeComponent,canActivate:[AuthGuard]},
  {path : 'addresource', component:AddResourceComponent,canActivate:[AuthGuard]},
  {path : 'resource/:id', component:EditResourceComponent,canActivate:[AuthGuard]},
{path : 'addcalendaritem', component : AddCalendarComponent,canActivate:[AuthGuard]},
{path : 'editcalendaritem/:calendarItemId', component : EditCalendarComponent,canActivate:[AuthGuard]},
{path: 'reset', component: ResetComponent},
{path: 'client', component: ClientComponent,canActivate:[AuthGuard]},
{path: 'emailuser', component: EmailUserComponent,canActivate:[AuthGuard]},
{path: 'addclient', component:AddClientComponent,canActivate:[AuthGuard]},
{path: 'video-player/:helpId', component: VideoPlayerComponent,canActivate:[AuthGuard]},
{path: 'help/add', component:AddHelpComponent,canActivate:[AuthGuard]},
{path:'help',component:GHelpComponent,canActivate:[AuthGuard]},
{path: 'help/edit/:id',component:EditHelpComponent,canActivate:[AuthGuard]},
{path:'help-type', component: HelpTypeComponent,canActivate:[AuthGuard]},
{path:'help-type/add',component: AddHelpTypeComponent,canActivate:[AuthGuard]},
{path:'help-type/edit/:id',component: EditHelpTypeComponent,canActivate:[AuthGuard]},
{path: 'add-claimitem', component: AddClaimItemComponent,canActivate:[AuthGuard]},
{path:'Claim-item',component:ClaimItemComponent,canActivate:[AuthGuard]},
{path: 'edit-claimitem',component:EditClaimItemComponent,canActivate:[AuthGuard]},
{path:'Claim-type', component: ClaimTypeComponent,canActivate:[AuthGuard]},
{path:'add-claimtype',component: AddClaimTypeComponent,canActivate:[AuthGuard]},
{path:'edit-claimtype',component:EditClaimTypeComponent,canActivate:[AuthGuard]},
{path: 'confirmation', component:ConfirmationDialogComponent,canActivate:[AuthGuard]},
{path:'user-help',component: UserHelpComponent,canActivate:[AuthGuard]},
{path: 'submitclaim',component: SubmittedclaimComponent, canActivate:[AuthGuard]},
{path:'resource', component:ResourceComponent,canActivate:[AuthGuard]},
{path: 'resourcetype',component:ResourceTypeComponent,canActivate:[AuthGuard]},
{path:'addresourcetype',component:AddResourceTypeComponent,canActivate:[AuthGuard]},
{path:'resourcetype/:id',component:EditResourceTypeComponent,canActivate:[AuthGuard]},
{path:'roles',component:RolesComponent,canActivate:[AuthGuard]},
{path:'add-role',component:AddRolesComponent,canActivate:[AuthGuard]},
{path:'edit-role',component:EditRoleComponent,canActivate:[AuthGuard]},
{path:'task', component:TasksComponent,canActivate:[AuthGuard]},
{path:'add-task', component:AddTaskComponent,canActivate:[AuthGuard]},
{path: 'add-task', component:EditTaskComponent,canActivate:[AuthGuard]},
{path: 'timecard', component: TimesheetetComponent,canActivate:[AuthGuard]},
{path: 'team-hours', component: TeamHoursReportComponent,canActivate:[AuthGuard]},
{path: 'project-progress', component: ProjectProgressComponent,canActivate:[AuthGuard]},
{path: 'project-request', component: LogProjectRequestComponent,canActivate:[AuthGuard]},
{path: 'project-requests', component: ProjectRequestsComponent,canActivate:[AuthGuard]},
{path : 'eemployee/:id', component:EditEmployeeComponent,canActivate:[AuthGuard]},
{path : 'question', component : QuestionsComponent, canActivate:[AuthGuard]},
{path : 'question/:id', component:QuestionsComponent, canActivate:[AuthGuard]},
{path: 'project', component: ProjectComponent,canActivate:[AuthGuard]},
{path: 'addproject', component: AddProjectComponent,canActivate:[AuthGuard]},
{path: 'project/:id', component: EditProjectComponent ,canActivate:[AuthGuard]},
{path: 'client/:id', component: EditClientComponent ,canActivate:[AuthGuard]},
  {path: 'addclient', component: AddClientComponent ,canActivate:[AuthGuard]},
  {path: 'addprojectAllocation', component: AddProjectAllocationComponent, canActivate:[AuthGuard]},
  {path: 'claimCapture', component: ClaimCaptureComponent,canActivate:[AuthGuard]},
  {path: 'projectAllocation', component: ProjectAllocationComponent ,canActivate:[AuthGuard]},
  {path: 'report', component: ReportsComponent ,canActivate:[AuthGuard]},
  {path : 'timesheet', component : TimeSheetApprovalComponent ,canActivate:[AuthGuard]},
  {path: 'audit-log', component: AuditLogComponent ,canActivate:[AuthGuard]},
  {path: 'log-audit', component: LogAuditComponent ,canActivate:[AuthGuard]},
  {path : 'clientReport', component : ClientReportComponent ,canActivate:[AuthGuard]},
  {path : 'chat-room', component : ChatRoomComponent ,canActivate:[AuthGuard]},
  {path : 'consolidatedReport', component : ConsolidatedProjectReportComponent ,canActivate:[AuthGuard]},
  {path : 'employeeReport', component : EmployeeReportComponent ,canActivate:[AuthGuard]},
  {path : 'backup-and-restore', component: BackupAndRestoreComponent ,canActivate:[AuthGuard]},
  { path: 'pdf-preview/:id', component: PdfPreviewComponent ,canActivate:[AuthGuard]},
  {path: 'unauthorised', component: UnauthorisedAccessComponent ,canActivate:[AuthGuard]},
  {path: 'addclaimcapture',component: AddClaimCaptureComponent, canActivate:[AuthGuard]},
  { path: 'editclaimcapture/:claimId', component: EditClaimCaptureComponent, canActivate:[AuthGuard]},
  {path : 'chatbot', component : ChatBotComponent, canActivate:[AuthGuard]},
  {path : 'max', component : MaxHoursComponent, canActivate:[AuthGuard]},
   {path : 'max/:id', component:EditMaxHoursComponent, canActivate:[AuthGuard]},
  {path : 'projectReport', component : ProjectReportComponent ,canActivate:[AuthGuard]},
  {path:"tcHelp", component: TimecardHelpComponent, canActivate:[AuthGuard]},
  {path: '', redirectTo: '/login', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
