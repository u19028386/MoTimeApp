import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { DataService } from 'src/app/services/data.service';
import { Question } from 'src/app/shared/question';

@Component({
  selector: 'app-edit-questions',
  templateUrl: './edit-questions.component.html',
  styleUrls: ['./edit-questions.component.css']
})
export class EditQuestionsComponent {
  questionForm: FormGroup;
  question: Question | null = null;
  originalQuestion: Question | null = null;
  changesMade = false;
  editMessage: string = 'Are you sure you want to update the item?';
  itemToEdit: string = '';
  questions: Question[] = [];
  displayModal: boolean = false;


  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: NgToastService


  ) {
    this.questionForm = new FormGroup({
      question1: new FormControl('', Validators.required),
      answer: new FormControl('', Validators.required),
      isAnswered: new FormControl(false, Validators.required)
    });
  }


  ngOnInit(): void {
    const questionId = +this.route.snapshot.params['id'];
    this.dataService.getQuestion(questionId).subscribe((result) => {
      this.question = result;
      if (this.question) {
        // Store the original question for comparison
        this.originalQuestion = { ...this.question };


        this.questionForm.patchValue({
          question1: this.question.question1 || '',
          answer: this.question.answer || '',
          isAnswered: this.question.isAnswered || false
        });
      }
    });
  }


  cancel() {
    this.router.navigate(['/question']);
  }


  openEditModal(question: Question) {
    this.itemToEdit = question.question1;
    this.displayModal = true;
  }


  closeModal() {
    this.displayModal = false;
  }


  editConfirmed() {
    if (!this.question) {
      return;
    }
   
 
    // Update the question with the form values
    this.question.question1 = this.questionForm.value.question1;
    this.question.answer = this.questionForm.value.answer;
    this.question.isAnswered = this.questionForm.value.isAnswered;
 
    // Check if changes were made
    this.changesMade = !this.isEqual(this.question, this.originalQuestion);
 
    if (this.changesMade) {
      // Call your API to update the question
      this.dataService.editQuestion(this.question.questionId, this.question).subscribe(
        (result) => {
          // Handle success
          this.toast.success({ detail: 'Success Message', summary: 'Question updated successfully', duration: 5000 });
        //   this.closeModal();
          this.router.navigate(['/question']);
        },
        (error) => {
          // Handle error
          this.toast.error({ detail: 'Error Message', summary: 'Failed to update question.', duration: 5000 });
          console.error('Error updating question:', error);
        }
      );
    } else {
      // No changes were made, display an error toaster
      this.toast.error({ detail: 'Error Message', summary: 'No changes were made', duration: 5000 });
      console.log('No changes were made to the question.');
    }
  }
 


  isEqual(objA: any, objB: any): boolean {
    // Function to check if two objects are equal
    return JSON.stringify(objA) === JSON.stringify(objB);
  }

}
