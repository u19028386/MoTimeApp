import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';


@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit{
  chatMessages: any[] = [];
  newMessage: string = '';

  constructor(private socket: Socket) {}

  ngOnInit(): void {
    // Listen for incoming chat messages
    this.socket.on('chat message', (message: any) => {
      this.chatMessages.push(message);
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim() !== '') {
      const messageData = {
        sender: 'Employee', // You can replace with user names
        message: this.newMessage,
      };
      this.socket.emit('chat message', messageData);
      this.newMessage = '';
    }
  }

}
