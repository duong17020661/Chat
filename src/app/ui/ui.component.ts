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

  constructor(
    private stringeeService: StringeeService,
    private messageService: MessagesService,
    private dataTransfer: DatatransferService,
    private route: ActivatedRoute,
    private router: Router) {
    this.route.params.subscribe(val => {
      this.convId = val.id;
      this.stringeeService.stringeeClient.on('connect', () => {
        // Lắng nghe trạng thái kết nối với Stringee
        this.stringeeService.onAuthen();
        this.stringeeService.onDisconnect();
        this.stringeeService.getConversation((status, code, message, convs) => {
          this.conversations = convs;
          for (let parti of convs[0].participants) {
            if (parti.userId != this.currentUser.id) {
              this.router.navigate(['/chat/' + convs[0].id]).then(() => {
                this.dataTransfer.setUser(parti.userId)
              });
              break;
            }
          }
          this.stringeeService.getLastMessages(this.conversations[0], (status, code, message, smsg) => {
            this.messages = smsg;
          });
        });

        this.stringeeService.getAndUpdateInfo();
      });
      this.stringeeService.stringeeChat.on('onObjectChange', () => {
        this.getConversations();
        this.getMessages();
      });
    })

  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.stringeeService.stringeeConnect(this.currentUser.token);
  }

  getConversations() {
    this.stringeeService.getConversation((status, code, message, convs) => {
      this.conversations = convs;
      for (let conv of convs) {
        if (conv.id == this.convId) {
          for (let parti of conv.participants) {
            if (parti.userId != this.currentUser.id) {
              this.dataTransfer.setUser(parti.userId)
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
