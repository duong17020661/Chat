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
  currentUser: any; // Người dùng hiện tại
  conversations: any; // List dữ liệu về cuộc trò chuyện
  convId: string; // Mã cuộc trò chuyện đang trỏ đến
  messages: any; // List dữ liệu về tin nhắn

  constructor(
    private _stringeeService: StringeeService,
    private _dataTransfer: DatatransferService,
    private _route: ActivatedRoute,
    private _router: Router) {
    // Tạo lại các đối tượng khi url thay đổi
    this._route.params.subscribe(val => {
      this.convId = val.id;
      this._stringeeService.stringeeClient.on('connect', () => {
        // Lắng nghe trạng thái kết nối với Stringee
        this._stringeeService.onAuthen();
        this._stringeeService.onDisconnect();
        // Lấy dữ liệu cuộc trò chuyện mới nhất
        this._stringeeService.getConversation((status, code, message, convs) => {
          this.conversations = convs;
          for (let parti of convs[0].participants) {
            if (parti.userId != this.currentUser.id) {
              this._router.navigate(['/chat/' + convs[0].id]).then(() => {
                this._dataTransfer.setUser(parti.userId)
              });
              break;
            }
          }
          // Lấy dữ liệu tin nhắn của cuộc trò chuyện mới nhất
          this._stringeeService.getLastMessages(this.conversations[0], (status, code, message, smsg) => {
            this.messages = smsg;
          });
        });
        // Cập nhật thông tin người dùng
        this._stringeeService.getAndUpdateInfo();
      });
      // Lắng nghe sự thay đổi của các cuộc trò chuyện và tin nhắn để cập nhật dữ liệu theo thời gian
      this._stringeeService.stringeeChat.on('onObjectChange', () => {
        console.log("-OJC-")
        this.getConversations();
        this.getMessages();
      });
    })
  }
  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    //Kết nối đến Stringee
    this._stringeeService.stringeeConnect(this.currentUser.token);
  }
  /**
   * Lấy dữ liệu về cuộc trò chuyện
   */
  getConversations() {
    this._stringeeService.getConversation((status, code, message, convs) => {
      this.conversations = convs;
      for (let conv of convs) {
        if (conv.id == this.convId) {
          for (let parti of conv.participants) {
            if (parti.userId != this.currentUser.id) {
              this._dataTransfer.setUser(parti.userId)
              break;
            }
          }
        }
      }
    });
  }
  /**
   * Lấy dữ liệu về tin nhắn
   */
  getMessages() {
    this._stringeeService.getLastMessages(this.convId, (status, code, message, smsg) => {
      this.messages = smsg;
    });
  }

}
