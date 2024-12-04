import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { format } from 'date-fns';
import { ChatsService } from '../services/chats.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrl: './chat-window.component.css'
})
export class ChatWindowComponent implements OnInit{

  @Input()
  selectedPreviousChat!: string;

  @Input()
  selectedChatAssistant!: string;

  userInput: string = '';
  chatHistory: { question: string; answer: string }[] = [];
  chatResponses: { type: 'question' | 'answer'; text: string; timestamp?: string; responseTime?: string }[] = []; // Stores questions and answers
  userIndication: string = 'You: ';
  radgeniIndication: string = 'RADgeni: ';
  errorMessage: any;
  isLoading: boolean = false;
  disableQuestionBox: boolean = false;
  previousChats: { id: number; name: string }[] = [];
  isChatQuestionaireEnabled:boolean = false;

  constructor(private chatService: ChatsService) {}

  ngOnInit(): void {
    this.chatService.currentChat$.subscribe(messages => {
      this.chatResponses = messages;
    });

    this.chatService.chats$.subscribe(chats => {
      this.previousChats = chats;
    });
  }

  submitQuestion(): void {
    if (this.userInput.trim()) {
      if(this.chatResponses?.length == 20) {
        this.errorMessage = 'Apologies. You have reached the maximum threshold of 20 questions';
        this.disableQuestionBox = true;
      } else {
        const question = this.userInput;
        this.userInput = `<strong class="userHighlight">${this.userIndication}</strong>`.concat(this.userInput);
        this.isLoading = true;
        this.disableQuestionBox = true;
        //this.userInput = 'You: '.concat(this.userInput);
        const startTime = new Date();
        this.chatResponses?.push({type: 'question', text: this.userInput});
        // const answer = this.generateResponse(question); 
        // this.chatResponses?.push({ type: 'answer', text: answer });
        // Simulate an async response
        setTimeout(() => {
          const answer = this.generateResponse(question); // Replace with an actual service call
          const endTime = new Date();
          const responseTime = (endTime.getTime() - startTime.getTime()) / 1000;
          this.chatResponses.push({ type: 'answer', text: answer,timestamp: this.getFormattedDateTime(), responseTime:`${responseTime.toFixed(2)} secs` });
          // Stop loading after the response is generated
          this.isLoading = false;
          this.disableQuestionBox = false;
        }, 200);
        this.userInput = '';
      } 
    }
  }

  generateResponse(question: string): string {
    // Mock response generation - replace with backend/service call
    return `<strong class="radgeniHighlight">${this.radgeniIndication}</strong>Based on the provided input, I will create a detailed response for "${question}" in the required format.`;
  }

  getFormattedDateTime(): string {
    const now = new Date();
    const requiredFormat = 'dd-MM-yyyy HH:mm:ss';
    console.log(format(now, requiredFormat));
    return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  }

  loadPreviousChat(chatId: number): void {
    this.chatService.loadChatById(chatId);
  }
}
