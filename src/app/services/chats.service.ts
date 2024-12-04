import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  constructor() { }

  private currentChat = new BehaviorSubject<any[]>([]);
  private previousChats = new BehaviorSubject<{ id: number; name: string; messages: any[] }[]>([]);
  private updatedEventData = new BehaviorSubject<any>({});

  chats$ = this.previousChats.asObservable();
  currentChat$ = this.currentChat.asObservable();
  

  // saveCurrentChat(messages: any[]): void {
  //   if (messages.length > 0) {
  //     const newChat = {
  //       id: this.chats.length + 1,
  //       name: `Chat ${this.chats.length + 1}`,
  //       messages: [...messages]
  //     };
  //     this.chats.push(newChat);
  //     this.chats$.next(this.chats.map(chat => ({ id: chat.id, name: chat.name })));
  //   }
  //   this.currentChat.next([]);
  // }

  saveCurrentChat(messages: any[], name: string): void {
    const newChat = {
      id: Date.now(),
      name,
      messages
    };

    const updatedChats = [...this.previousChats.getValue(), newChat];
    this.previousChats.next(updatedChats);
  }

  loadChatById(chatId: number): void {
    chatId = Number(chatId);
    const chat = this.previousChats.getValue().find(c => (c.id === chatId));
    if (chat) {
      this.currentChat.next(chat.messages);
    } else if (chat == undefined) {
      this.currentChat.next([]);
    }
  }

  resetCurrentChat(): void {
    this.currentChat.next([]);
  }

  getCurrentChat(): any[] {
    return this.currentChat.getValue(); // Directly access the current chat messages
  }

  getPreviousChat(): any[] {
    return this.previousChats.getValue();
  }

  updatePreviousChatName(chatId: number, newName: string): void {
    const chats = this.previousChats.getValue();
    chatId = Number(chatId);
    const chatIndex = chats.findIndex((chat) => chat.id === chatId);
  
    if (chatIndex > -1) {
      chats[chatIndex].name = newName;
      this.previousChats.next(chats); // Emit the updated chats list
    }
  }

  /**
   * Function to trigger the event sent with the data using
   * Behavior Subject
   * @param event
   * @param data
   */
  triggerCompEvent(event: any, data: any) {
    this.updatedEventData.next({ event, data });
  }

  /**
   * Function that returns the Behavior Subject
   * @returns BehaviorSubject
   */
  getEventFromComp(): BehaviorSubject<any> {
    return this.updatedEventData;
  }
}
