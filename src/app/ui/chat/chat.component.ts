import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users/users.service';
import { DatatransferService } from 'src/app/services/datatransfer.service';
import { IUser } from 'src/models/user';
import { MainChatComponent } from './main-chat/main-chat.component';
import { InfoChatComponent } from './info-chat/info-chat.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @Input() messages: any; // List dữ liệu về tin nhắn
  public users = [] // List dữ liệu người dùng
  public usersID; // ID người dùng đang được trỏ đến
  user: IUser; // Thông tin người dùng đang được trỏ đến
  constructor(
    private _route: ActivatedRoute,
    private _userservice: UsersService,
    private _dataTransferService: DatatransferService) {
    // Tạo lại các đối tượng khi có thay đổi
    this._route.params.subscribe(val => {
      this.getUserId();
    });
  }

  ngOnInit(): void {

  }

  isShowDivIf = false; // Hiện/đóng thông tin cuộc trò chuyện

  /**
   * Xử lý hiện và đóng thông tin cuộc trò chuyện
   */
  toggleDisplayDivIf() {
    this.isShowDivIf = !this.isShowDivIf;
    if (!this.isShowDivIf) {
      document.getElementById("c4").style.width = "calc(100% - 300px)";
      document.getElementById("c3").style.width = "300px";
    }
    else {
      document.getElementById("c4").style.width = "100%";
      document.getElementById("c3").style.width = "0";
    }
  }

  /** 
   * Tính chênh lệch giữa 2 khoảng thời gian theo phút
   */
  timeDiff(dateSent) {
    let currentDate = new Date();
    dateSent = new Date(dateSent);
    return Math.floor((currentDate.getTime() - dateSent.getTime()) / (1000 * 60));
  }
  /**
   * Lấy thông tin dữ liệu về người dùng theo Id
   */
  getUserId() {
    this._dataTransferService.getUser$.subscribe(data => {
      this._userservice.getUser(data).subscribe(user => this.user = user)
    })
  }

}

