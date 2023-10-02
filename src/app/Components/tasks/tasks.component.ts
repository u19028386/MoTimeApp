import { Component, OnInit } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { APIService } from 'src/app/services/api.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit{
  tasks: any[] = [];
  selectedTask: any = {};
  isEditing = false;

  constructor(private apiService: APIService, 
    private toastr: NgToastService,
    private dialog: MatDialog,) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.apiService.getAllTasks().subscribe(
      (data) => {
        this.tasks = data;
      },
      (error) => {
        console.error('Error loading tasks:', error);
      }
    );
  }
  addTask(task: any): void {
    this.apiService.addTask(task).subscribe(
      (data) => {
        this.tasks.push(data);
        this.clearSelectedTask();
      },
      (error) => {
        console.error('Error adding task:', error);
      }
    );
  }

  editTask(id: number, task: any): void {
    this.apiService.editTask(id, task).subscribe(
      (data) => {
        const index = this.tasks.findIndex(t => t.taskId === id);
        if (index !== -1) {
          this.tasks[index] = data;
          this.clearSelectedTask();
        }
      },
      (error) => {
        console.error('Error editing task:', error);
      }
    );
  }

  deleteTask(id: number): void {
    this.apiService.deleteTask(id).subscribe(
      () => {
        this.tasks = this.tasks.filter(t => t.taskId !== id);
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          data: { title: 'Confirm Deletion', message: 'Are you sure you want to delete this task?' },
          width: '350px',
          height: '200px',
          position: {
            top: '0px',
            left: '600px',
          },
        });
        this.toastr.success({ detail: 'SUCCESS', summary: "The task was successfully deleted!", duration: 3000 });
      },
      (error) => {
        console.error('Error deleting task:', error);
      }
    );
  }

  selectTask(task: any): void {
    this.selectedTask = { ...task };
    this.isEditing = true;
  }

  clearSelectedTask(): void {
    this.selectedTask = {};
    this.isEditing = false;
  }

}
