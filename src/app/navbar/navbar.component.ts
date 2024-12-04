import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatWindowComponent } from '../chat-window/chat-window.component';
import { ChatsService } from '../services/chats.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @ViewChild(ChatWindowComponent) chatWindowComponent!: ChatWindowComponent;

  constructor(private chatService: ChatsService) {}

  showChatWindown: boolean = false;
  selectedPreviousChat: any;
  selectedChatId: number = 0; // Tracks the selected chat ID
  previousChats: { id: number; name: string; messages: any[] }[] = [];
  isEditing = false;
  editingChatId: number | null = null;
  editingChatName: string = '';

  ngOnInit(): void {
    // Subscribe to the previous chats list
    this.chatService.chats$.subscribe(chats => {
      this.previousChats = chats;
    });

    this.selectedChatId = 0;
  }

  onNewChat(): void {
    const currentConversation = this.chatService?.getCurrentChat();
    if (currentConversation.length > 0) {
      const timestamp = new Date();
      this.chatService.saveCurrentChat(
        currentConversation,
        `Chat on ${timestamp.toLocaleString()}`
      );
    }

    this.chatService?.resetCurrentChat();
    this.selectedChatId = 0;
  }

  onChatSelectionChange(): void {
    if (this.selectedChatId) {
      // Load the selected chat into the chat window
      this.chatService.loadChatById(this.selectedChatId);
    } else {
      // Clear the chat window if "Current Chat..." is selected
      this.chatService.resetCurrentChat();
    }
  }

  editChatName() {
    if (this.selectedChatId !== null) {
      this.isEditing = true;
      this.selectedChatId = Number(this.selectedChatId);
      this.editingChatId = this.selectedChatId;

      // Find the current chat's name for editing
      const currentChat = this.previousChats.find(
        (chat) => chat.id === this.selectedChatId
      );
      this.editingChatName = currentChat ? currentChat.name : '';
    }
  }

  saveEditedChatName(): void {
    if (this.editingChatId !== null && this.editingChatName.trim() !== '') {
      this.chatService.updatePreviousChatName(this.editingChatId, this.editingChatName);
      this.isEditing = false;
      this.editingChatId = null;
      this.editingChatName = '';
    }
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.editingChatId = null;
    this.editingChatName = '';
  }
}
