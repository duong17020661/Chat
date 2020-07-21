import { Component, OnInit } from '@angular/core';
import { StringeeService } from '../services/stringee/stringee.service';
import { DatatransferService } from '../services/datatransfer.service';
import { ActivatedRoute } from '@angular/router';

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

  constructor(private stringeeService: StringeeService, private dataTransfer: DatatransferService, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.convId = this.route.snapshot.paramMap.get('id');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    console.log(this.currentUser.id)
    this.stringeeService.stringeeConnect(this.currentUser.token);
    this.stringeeService.stringeeClient.on('connect', () => {
      console.log("+++connected");
      this.getConversations();
      this.stringeeService.getAndUpdateInfo();
      this.getMessages();
    });
    this.stringeeService.stringeeChat.on('onObjectChange', () => {
      console.log("+++Objectchange");
      this.stringeeService.getConversation((status, code, message, convs) => {
        this.conversations = convs;
      });
      this.getMessages();
    });
  }

  getConversations() {
    this.stringeeService.getConversation((status, code, message, convs) => {
      this.conversations = convs;
      console.log(this.conversations)
      for (let conv of convs) {
        if (conv.id == this.convId) {
          for (let parti of conv.participants) {
            if (parti.userId != this.currentUser.id) {
              console.log(parti.userId)
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
