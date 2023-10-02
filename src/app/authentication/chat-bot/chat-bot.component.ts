import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chatbotservice.service';
import { ProjectAllocationView } from 'src/app/shared/projectAllocationView';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css']
})
export class ChatBotComponent implements OnInit{
  employeeId!: number;
  projectAllocations: ProjectAllocationView[] = [];
  errorMessage: string = '';
  role: string = "";


  constructor(private projectAllocationService: ChatService) { }
  ngOnInit(): void {
    
  
  }




  retrieveProjectAllocations(): void {
    this.errorMessage = '';
    this.projectAllocationService.getProjectAllocationsForEmployee(this.employeeId)
      .subscribe(
        projectAllocations => {
          if (projectAllocations.length === 0) {
            this.errorMessage = 'No project allocations found for this employee or employee id does not exist.';
          } else {
            this.projectAllocations = projectAllocations;
          }
        },
        error => {
          this.errorMessage = 'No project allocations found for this employee or employee id does not exist.';
          console.error(error);
        }
      );
  }
}

