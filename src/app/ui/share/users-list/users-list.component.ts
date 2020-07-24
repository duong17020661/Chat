import { Component, OnInit, Input  } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../../services/users/users.service';
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
  convId: string;
  userID: string = JSON.parse(localStorage.getItem('currentUser')).id
  token: string = JSON.parse(localStorage.getItem('currentUser')).token
  user: IUser;

  // List chứa tất cả dữ liệu về User
  public userResource = []; // Dữ liệu lưu để so sánh
  public users = [];
  @Input() conversations: any; // List dữ liệu về cuộc trò chuyện

  constructor(
    private router: Router,
    private _chatservice: MessagesService,
    private _userservice: UsersService,
    private route: ActivatedRoute,
    private _datatransfer: DatatransferService,
    private _stringeeservice: StringeeService
  ) {
    // Lấy ID hiện tại đang trỏ đến
    this.route.params.subscribe(val => {
      this.convId = val.id;
      this._datatransfer.Id.subscribe((res) => {
        this.getConvesationList();
      })
    });
  }

  ngOnInit(): void {
    // Lấy danh sách người dùng sắp xếp theo ngày
    this._userservice.getUsers().subscribe(data => {
      this.users = data;
      this.userResource = data;
    });
    // Lấy danh sách tin nhắn sắp xếp theo ngày

  }
  getConv(){
    this._datatransfer.Id.subscribe((data) => {
      this.getConvesationList();
    })
  }
  // Lấy dữ liệu cuộc trò chuyện gần nhất
  getConvesationList() {
    this._stringeeservice.getConversation((status, code, message, convs) => {
      this.conversations = convs;
      for (let conv of convs) {
        if (conv.id == this.convId) {
          this.onSelectConv(conv)
          break;
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
    var options = {
      isDistinct: true,
      isGroup: false
    };
    this._stringeeservice.stringeeChat.createConversation([user.id], options, (status, code, message, conv) => {
       //console.log('status:' + status + ' code:' + code + ' message:' + message + ' conv:' + JSON.stringify(conv));
       this.router.navigate(['/chat/' + conv.id]).then(() => {
        this._datatransfer.setUser(user.id)
      });
    });
  }
  // Hàm xử lý sự kiện click vào cuộc trò chuyện
  onSelectConv(conv) {
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
    this._stringeeservice.stringeeChat.markConversationAsRead(this.convId)
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
  Add(){
    this._userservice.getUserOnline(this.token).subscribe((res) => {
      console.log(res)
    })
  }
}

