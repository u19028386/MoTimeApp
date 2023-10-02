import { Component, ViewChild } from '@angular/core';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import { Question } from 'src/app/shared/question';
import { DataService } from 'src/app/services/data.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent {
  @ViewChild(DeleteConfirmationModalComponent) deleteConfirmationModal!: DeleteConfirmationModalComponent;


  deleteMessage: string = 'Are you sure you want to delete the item?';
  questions: Question[] = [];
  filtered: Question[] = [];
  searchName: string = '';
  itemToDelete: string = '';


  constructor(private dataService: DataService, private toast: NgToastService) {}


  ngOnInit(): void {
    this.getQuestions();
  }


  getQuestions() {
    this.dataService.getQuestions().subscribe((result: Question[]) => {
      this.questions = result;
      this.filtered = result;
    });
  }


  openDeleteModal(question: Question) {
    this.itemToDelete = question.question1;
    this.deleteConfirmationModal.openModal(this.itemToDelete);
  }


  deleteConfirmed() {
    if (this.itemToDelete) {
      const questionToDelete = this.questions.find((question) => question.question1 === this.itemToDelete);
      if (questionToDelete) {
        this.dataService.deleteQuestion(questionToDelete.questionId).subscribe(
          (result) => {
            this.toast.success({ detail: 'Success Message', summary: 'Question deleted successfully.', duration: 5000 });
            this.getQuestions();
          },
          (error) => {
            this.toast.error({ detail: 'Error Message', summary: 'Cannot delete employee because it linked to an employee.', duration: 5000 });
          }
        );
      }
    }


    this.itemToDelete = '';
  }


  search(): void {
    if (!this.searchName) {
      this.toast.error({ detail: 'Error Message', summary: 'Please enter a search term.', duration: 5000 });
      return;
    }
 
    this.filtered = this.questions.filter((question) =>
      Object.values(question).some((value) =>
        value && value.toString().toLowerCase().includes(this.searchName.toLowerCase())
      )
    );
  }

}
