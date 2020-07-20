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
import * as jwt_decode from "jwt-decode";


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
  convId: string;
  userID: string = JSON.parse(localStorage.getItem('currentUser')).id

  // List chứa tất cả dữ liệu về User
  public userResource = []; // Dữ liệu lưu để so sánh
  public users = [];
  public conversation: any // List dữ liệu về cuộc trò chuyện

  constructor(
    private router: Router,
    private _chatservice: MessagesService,
    private _userservice: UsersService,
    private route: ActivatedRoute,
    private _datatransfer: DatatransferService,
    private _stringeeservice: StringeeService
  ) {
    console.log(this.route.snapshot.paramMap.get('id'))
    route.params.subscribe(val => {
      this.convId = val.id;
      this.getConvId();
    });

  }

  ngOnInit(): void {
    // Lấy ID hiện tại đang trỏ đến
    this._stringeeservice.stringeeClient.on('connect', () => {
      // Get dữ liệu cuộc trò chuyện và cập nhật thông tin người dùng lên Stringee
      this.getConvesationList();
      this._stringeeservice.getAndUpdateInfo();
    });
    // Lấy danh sách người dùng sắp xếp theo ngày
    this._userservice.getUsers().pipe(
      map(users => users.sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()))
    ).subscribe(data => {
      this.users = data;
      this.userResource = data;
    });
    this._userservice.getUser(this.userID).subscribe(data => console.log(data))
    // Lấy danh sách tin nhắn sắp xếp theo ngày

  }
  // lấy dữ liệu convId
  getConvId(){
    this._datatransfer.Id.subscribe((data) => {
      this.convId = data
      this.getConvesationList();
    })
  }
  // Lấy dữ liệu cuộc trò chuyện gần nhất
  getConvesationList() {
    this._stringeeservice.getConversation((status, code, message, convs) => {
      this.conversation = convs;
      for (let conv of this.conversation) {
        if (conv.id == this.convId) {
          this.onSelectConv(conv)
        }
      }
    });
  }
  // Hàm ẩn thông báo tin nhắn chưa đọc
  disableNewMessage(userid) {
    for (var i = 0; i < this.users.length; i++) {
      if (this.users[i].id == userid) {
        this.users[i].newMessage = 0;
      }
    }
  }
  // Hàm xử lý sự kiện click vào user
  onSelect(user: IUser) {
    this.convId = user.id;
    user.newMessage = 0;
    this._stringeeservice.createConversation([this.convId]);
  }
  // Hàm xử lý sự kiện click vào cuộc trò chuyện
  onSelectConv(conv) {
    this.convId = conv.id;
    let userIDs = [];
    var j = 0;
    for (let user of conv.participants) {
      if (user.userId != this.userID) {
        this._datatransfer.setUser(user.userId)
        userIDs[j] = user.userId;
        j++;
      }
    }

    this._stringeeservice.createConversation(userIDs)
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
    let dateDiff = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24));
    return dateDiff
  }
  // Hàm chuyển dữ liệu thành Date()
  convertDate(date) {
    return new Date(date);
  }

  // Hàm chuyển tab khi focus vào search
  openUser(tabNames) {
    var i, tabcontent;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    document.getElementById(tabNames).style.display = "block";
  }

}

