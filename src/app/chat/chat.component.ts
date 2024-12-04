import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ChatWindowComponent } from '../chat-window/chat-window.component';

declare let $: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit{

  assistants = ['Personal AI Assistant', 'Enterprise AI Assistant'];
  models: any[] = [];
  chatOptions:any[] = [];
  selectedAssistant: string = "";
  selectedModel: string = '';
  selectedChatOption: string = '';
  selectedUploadOption:string = '';
  chatHistory: string[] = [];
  uploadOptions:any[] = [];
  query: string = '';
  isModelDisabled:boolean = true
  isChatOptionDisabled:boolean = true;
  showUploadOptions:boolean = false;
  isSubmitAllowed:boolean = false;
  showChatWindown:boolean = false;

  @ViewChild(ChatWindowComponent) chatWindowComponent!: ChatWindowComponent;

  public assistantFormControl = new FormControl('', Validators.required);
  public chatFormControl = new FormControl('');
  public modelFormControl = new FormControl('');

  ngOnInit(): void {
    this.modelFormControl.disable();
    this.chatFormControl.disable();
    this.selectedAssistant = "";
    //TODO: Make all master calls

  }

  onModelSelection(event: any) {
    if(event.currentTarget.value === "null") {
      this.chatOptions = [];
      this.chatFormControl.disable();
    } else {
      this.chatOptions = [{value:'Chat with RADgeni', disabled:false}, {value:'Integrate with Rally', disabled:false},
        {value:'Converse with Files', disabled: false}, {value: 'Generate Documentation', disabled: true},
        {value:'Create Presentation',disabled: true}, {value: 'Connect with DB', disabled: true}
      
      ];
      this.isChatOptionDisabled = false;
      this.chatFormControl.enable();
    }    
  }

  onAssistantSelection(event: any) {
    if(event?.currentTarget?.value === 'Personal AI Assistant') {
      this.models = ['Generic Q&A', 'S/W Dev - Coding', 'Data Engineering - SQL'];
      this.isModelDisabled = false;
      this.modelFormControl.enable();
    } else if(event?.currentTarget?.value === 'Enterprise AI Assistant') {
      this.models = [];
      this.chatOptions = [];
      this.modelFormControl.disable();
      this.chatFormControl.disable();
    }
  }

  onChatOptionSelection() {
    if(this.selectedChatOption === "Converse with Files") {
      this.showUploadOptions = true;
    } else {
      this.showUploadOptions = false;
    }
  }

  openFileOrFolderExplorer() {
    //event.preventDefault();
    if(this.selectedUploadOption == "selectFile") {
      let fileInput: HTMLElement = document.querySelector('#fileInput')!;
      fileInput.click();
    } else if (this.selectedUploadOption == "selectFolder") {
      let folderInput: HTMLElement = document.querySelector('#folderInput')!;
      folderInput.click();
    }
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      console.log('Selected file:', selectedFile.name);
      this.isSubmitAllowed = true; 
    } else {
      this.isSubmitAllowed = false;
    }
  }

  // onFolderSelected(event: any) {
  //   const selectedFolder = event.target.files;
  //   if(selectedFolder?.length > 0) {
  //     console.log('Selected Folder', selectedFolder[0]?.webkitRelativePath);
  //     this.isSubmitAllowed = true;
  //   } else {
  //     this.isSubmitAllowed = false;
  //   }
  // }
  onFolderSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
  
    // Debug to verify the event is triggering and files are accessible
    console.log('Event triggered:', event);
    console.log('Files:', files);
  
    if (files && files.length > 0) {
      console.log('Selected folder contents:');
      Array.from(files).forEach(file => {
        console.log('File path:', file.webkitRelativePath); // Logs full relative path of each file
      });
      this.isSubmitAllowed = true; // Enable submit button
    } else {
      console.log('No folder selected');
      this.isSubmitAllowed = false;
    }
  }

  checkSubmitAllowed() {
    if(this.isSubmitAllowed)
      this.isSubmitAllowed = false;
  }

  sendMessage() {
    if (this.query.trim()) {
      this.chatHistory.push(this.query);
      this.query = '';
    }
  }

}
