import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../../services/users/users.service';
import { IUsers } from 'src/models/users';
import { map } from 'rxjs/operators';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { DatatransferService } from 'src/app/services/datatransfer.service';
import { StringeeService } from '../../../services/stringee/stringee.service'
import { IUser } from 'src/models/user';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  // List chứa tất cả dữ liệu về Inbox
  public messages = [];

  spinnerService: any;
  searchTerm: string;
  usersID: string;

  // List chứa tất cả dữ liệu về User
  public userResource = []; // Dữ liệu lưu để so sánh
  public users = [];

  constructor(
    private router: Router, 
    private _chatservice: MessagesService, 
    private _userservice: UsersService, 
    private route: ActivatedRoute, 
    private _datatransfer: DatatransferService,
    private _stringeeservice: StringeeService
    ) {
    this.getUserID()
  }

  ngOnInit(): void {
    // Lấy ID hiện tại đang trỏ đến
    this.getUserID()
    // Lấy danh sách người dùng sắp xếp theo ngày
    this._userservice.getUsers().pipe(
      map(users => users.sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()))
    ).subscribe(data => {
      this.users = data;
      this.userResource = data;
    });
    // Lấy danh sách tin nhắn sắp xếp theo ngày
    this._chatservice.getMessages().pipe(
      map(users => users.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()))
    ).subscribe(data => {
      this.messages = data;
    });
  }
  // Hàm lấy dữ liệu lastMessage
  getLastMessage(user: IUsers) {
    for (var i = 0; i < this.messages.length; i++) {
      if (this.messages[i].receiverID == user.id || this.messages[i].senderID == user.id) {
        user.lastMessage = this.messages[i].message;
      }
    }
    return user.lastMessage
  }
  // Hàm ẩn thông báo tin nhắn chưa đọc
  disableNewMessage(userid) {
    for (var i = 0; i < this.users.length; i++) {
      if (this.users[i].id == userid) {
        this.users[i].newMessage = 0;
      }
    }
  }
  // Hàm lấy ID đang trỏ đến
  getUserID() {
    this._datatransfer.userId.subscribe(data => {
      this.usersID = data;
      this.disableNewMessage(data)
    })
  }
  // Hàm xử lý sự kiện click vào user
  onSelect(user: IUser) {
    
    this.usersID = user.id;
    user.newMessage = 0;
    this._stringeeservice.createConversation(user);
  }
  // Hàm tìm kiếm cuộc trò chuyện
  search(): void {
    let term = this.searchTerm;
    this.users = this.userResource.filter(function (tag) {
      let fullName = tag.firstName + " " + tag.lastName;
      return fullName.indexOf(term) >= 0;
    });
  }
  // Hàm tính sự chệnh lệch giữa 2 khoảng thời gian
  timeBetween: number // 1 : giờ | 2 : thứ | 3 : ngày
  calculateDiff(dateSent) {
    let currentDate = new Date();
    dateSent = new Date(dateSent);
    return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24));
  }
  // Hàm chuyển dữ liệu thành Date()
  convertDate(date) {
    return new Date(date);
  }
}

