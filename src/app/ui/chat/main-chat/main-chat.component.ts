import { Component, OnInit, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { MessagesService } from '../../../services/messages/messages.service';
import { ActivatedRoute } from '@angular/router';
import { IMessages } from '../../../../models/messages';
import { DatatransferService } from 'src/app/services/datatransfer.service';
import { UsersService } from 'src/app/services/users/users.service';
import { map } from 'rxjs/internal/operators/map';

class FileSpinnet {
  constructor(public src: string, public file: File) { }
}


@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.scss']
})
export class MainChatComponent implements OnInit {

  public userID;
  public messages = [];
  public users = [];
  modalImg: any;
  popup: any;


  constructor(private _chatservice: MessagesService, private route: ActivatedRoute, private _users: UsersService,  private _datatransfer: DatatransferService) {
    route.params.subscribe(val => {
      this._chatservice.getMessages().pipe(
        map(users => users.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()))
      ).subscribe(data => {
        this.messages = data;
      });
      this._users.getUsers().subscribe(data => this.users = data);
      let id = parseInt(this.route.snapshot.paramMap.get('id'));
      this.userID = id;
      this.addTimeDiff(this.messages);
    });
  }

  ngOnInit(): void {
    this.modalImg = document.getElementById("img");
    this._chatservice.getMessages().pipe(
      map(users =>
        users.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()))
    ).subscribe(data => {
      this.messages = data;
      this.addTimeDiff(this.messages)
    });
    this.addTimeDiff(this.messages);
    let id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.userID = id;
  }

  onEnter(value: string) {
    if (value) {
      let message: IMessages = { id: this.messages.length + 1, message: value, senderID: 0, receiverID: this.userID, time: Date(), type: "text" };
      this.messages.push(message);
      this._datatransfer.setMessages(message);
      console.log(this.messages)
    }
  }

  addTimeDiff(messages){
    for(let i = 1 ; i < messages.length ; i++){
      console.log(messages[i].time, messages[i-1].time)
      messages[i].timeDiff = this.timeBetween(this.messages[i-1].time, this.messages[i].time)
    }
  }
 
  @ViewChild('scrollframe', { static: false }) scrollFrame: ElementRef;
  @ViewChildren('item') itemElements: QueryList<any>;

  private scrollContainer: any;
  private items = [];

  ngAfterViewInit() {
    this.scrollContainer = this.scrollFrame.nativeElement;
    this.itemElements.changes.subscribe(_ => this.onItemElementsChanged());

    // Add a new item every 2 seconds
    setInterval(() => {
      this.items.push({});
    }, 2000);
  }

  private onItemElementsChanged(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  selectedFile: FileSpinnet

  processImage(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new FileSpinnet(event.target.result, file);
      let message: IMessages = { id: this.messages.length + 1, message: this.selectedFile.src, senderID: 0, receiverID: this.userID, time: Date(), type: "image" };
      this.messages.push(message)
      this._datatransfer.setMessages(message);
    });
    reader.readAsDataURL(file);


  }

  processFile(fileInput: any) {
    const file: File = fileInput.files[0];
    let fileType: string;
    fileType = fileInput.files[0].name.split(".").pop()
 
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new FileSpinnet(event.target.result, file);
      let message: IMessages = { id: this.messages.length + 1, message: this.selectedFile.file.name, senderID: 0, receiverID: this.userID, time: Date(), type: 'file', typeof: fileType , url: this.selectedFile.src };
      this.messages.push(message)
      this._datatransfer.setMessages(message);
      console.log(this.selectedFile.src)
    });
    reader.readAsDataURL(file);
  }

  openFile(url: string) {
    window.open(url, "");
  }

  ModalImage(src: string){
    this.modalImg.src = src;
    this.modalImg.style.width = "auto";
    this.modalImg.style.height = "auto";
  }

  getAvatar(){
    for(var i = 0 ; i < this.users.length; i++){
      if(this.users[i].id == this.userID ){
        return this.users[i].photo
      }
    }
  }

  calculateDiff(dateSent){
    let currentDate = new Date();
    dateSent = new Date(dateSent);
 
     return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) ) /(1000 * 60 * 60 * 24));
   }
  convertDate(date){
    return new Date(date);
  }
  showPopupLeft: boolean = false;
  showPopupRight: boolean = false;
  popupRight() {
    if(this.showPopupRight){
      this.showPopupRight = false;
    }
    else{
      this.showPopupRight = true;
    }
  }
  popupLeft() {
    if(this.showPopupLeft){
      this.showPopupLeft = false;
    }
    else{
      this.showPopupLeft = true;
    }
  }
  PopupIcon: boolean = false
  showPopupIcon() {
      if(this.PopupIcon){
        this.PopupIcon = false;
      }
      else{
        this.PopupIcon = true;
      }
    }

    timeBetween(dateSent1, dateSent2){
      dateSent1 = new Date(dateSent1);
      dateSent2 = new Date(dateSent2);
      return (dateSent2.getTime() - dateSent1.getTime())/(1000 * 60);
     }

}
