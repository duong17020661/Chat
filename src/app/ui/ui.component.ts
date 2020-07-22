import { Component, OnInit } from '@angular/core';
import { StringeeService } from '../services/stringee/stringee.service';
import { DatatransferService } from '../services/datatransfer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagesService } from '../services/messages/messages.service';


@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.scss']
})
export class UiComponent implements OnInit {
  currentUser: any;

  conversations: any;
  convId: string;
  messages: any;
  files: any;

  constructor(private stringeeService: StringeeService, private messageService: MessagesService, private dataTransfer: DatatransferService, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.stringeeService.stringeeConnect(this.currentUser.token);
    this.route.params.subscribe(val =>{
      this.convId = val.id;
    })
    this.stringeeService.stringeeClient.on('connect', () => {
      console.log("+++connected");
      this.getConversations();
      this.getMessages();
      this.stringeeService.getAndUpdateInfo();
    });
    this.stringeeService.stringeeChat.on('onObjectChange', () => {
      console.log("+++Objectchange");
      this.getConversations();
      this.getMessages();
    });

  }

  getConversations() {
    this.stringeeService.getConversation((status, code, message, convs) => {
      this.conversations = convs;
      console.log("------------------------------------------------")
      for (let conv of convs) {
        if (conv.id == this.convId) {
          for (let parti of conv.participants) {
            if (parti.userId != this.currentUser.id) {
              this.dataTransfer.setUser(parti.userId);
              break;
            }
          }
        }
      }
    });
  }

  getMessages() {
    this.stringeeService.getLastMessages(this.convId, (status, code, message, smsg) => {
      this.messages = smsg;
    });
  }

}
