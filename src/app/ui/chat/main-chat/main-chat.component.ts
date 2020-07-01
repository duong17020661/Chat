import { Component, OnInit, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { MessagesService } from '../../../services/messages/messages.service';
import { ActivatedRoute } from '@angular/router';
import { IMessages } from '../../../../models/messages';

class ImageSpinnet {
  constructor(public src: string, public file: File) {}
}


@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.scss']
})
export class MainChatComponent implements OnInit {

  public userID;
  public messages = [];

  constructor(private _chatservice: MessagesService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this._chatservice.getMessages().subscribe(data => this.messages = data);
    let id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.userID = id;
  }

  onEnter(value: string) {
    if (value) {
      let message: IMessages = { id: this.messages.length + 1, message: value, senderID: 0, receiverID: this.userID, time: Date(), type: "text" };
      this.messages.push(message);
      console.log(this.messages)
    }
  }

  @ViewChild('scrollframe', {static: false}) scrollFrame: ElementRef;
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

  selectedFile: ImageSpinnet

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    var url_image: string
    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSpinnet(event.target.result, file);
      let message: IMessages = { id: this.messages.length + 1, message: this.selectedFile.src , senderID: 0, receiverID: this.userID, time: Date(), type: "image" };
      this.messages.push(message)
    });
    reader.readAsDataURL(file);
    
    
  }

}
