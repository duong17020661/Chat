import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../../services/users/users.service';
import { DatatransferService } from 'src/app/services/datatransfer.service';
import { StringeeService } from '../../../services/stringee/stringee.service'
import { IUser } from 'src/models/user';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  public messages = []; // List dữ liệu về tin nhắn
  searchTerm: string; // Dữ liệu tìm kiếm
  convId: string; // Mã cuộc trò chuyện
  userID: string = JSON.parse(localStorage.getItem('currentUser')).id // Id người dùng hiện tại
  token: string = JSON.parse(localStorage.getItem('currentUser')).token // token của người dùng
  user: IUser; // Dữ liệu về người dùng đang trỏ đến
  switchtab = 0; // Dùng để hiển thị màn hình khi chưa có cuộc trò chuyện nào
  public userResource = []; // Dữ liệu lưu để so sánh
  public users = []; // List chứa tất cả dữ liệu về User
  @Input() conversations: any; // List dữ liệu về cuộc trò chuyện

  constructor(
    private _router: Router,
    private _userService: UsersService,
    private _route: ActivatedRoute,
    private _dataTransfer: DatatransferService,
    private _stringeeService: StringeeService
  ) {
    // Tạo lại các đối tượng khi đường dẫn thay đổi
    this._route.params.subscribe(val => {
      this.convId = val.id;
      this._dataTransfer.Id.subscribe((res) => {
        this.getConvesationList();
      })
    });
  }

  ngOnInit(): void {
    // Lấy danh sách tất cả người dùng
    this._userService.getUsers().subscribe(data => {
      this.users = data;
      this.userResource = data;
    });
  }
  /**
   * Lấy dữ liệu các cuộc trò chuyện dựa vào convId được truyền từ MainChat
   */
  getConv() {
    this._dataTransfer.Id.subscribe((data) => {
      this.getConvesationList();
    })
  }
  /**
   * Lấy dữ liệu các cuộc trò chuyện và truyền Id người đang trò chuyện đến các component khác
   */
  getConvesationList() {
    this._stringeeService.getConversation((status, code, message, convs) => {
      this.conversations = convs;
      if (convs) {
        for (let conv of convs) {
          if (conv.id == this.convId) {
            this.onSelectConv(conv)
            break;
          }
        }
      }
    });
  }
  /**
   * Hàm xử lý khi người dùng chọn người muốn trò chuyện
   * @param user Người dùng được chọn
   */
  onSelect(user: IUser) {
    var options = {
      isDistinct: true,
      isGroup: false
    };
    this._stringeeService.stringeeChat.createConversation([user.id], options, (status, code, message, conv) => {
      // Chuyển đến cuộc trò chuyện giữa 2 người
      this._router.navigate(['/chat/' + conv.id]).then(() => {
        this._dataTransfer.setUser(user.id)
      });
    });
  }
  /**
   * Hàm xử lý khi chọn vào 1 cuộc trò chuyện nào đó
   * @param conv Cuộc trò chuyện được chọn
   */
  onSelectConv(conv) {
    let userIDs = [];
    var j = 0;
    for (let user of conv.participants) {
      if (user.userId != this.userID) {
        this._dataTransfer.setUser(user.userId)
        userIDs[j] = user.userId;
        j++;
      }
    }
    this._stringeeService.createConversation(userIDs)
    // Đánh dấu đã đọc hết tất cả tin nhắn
    this._stringeeService.stringeeChat.markConversationAsRead(this.convId)
  }
  /**
   * Tìm kiếm người dùng muốn trò chuyện cùng
   */
  search(): void {
    let term = this.searchTerm;
    this.users = this.userResource.filter(function (tag) {
      let fullName = tag.firstName + " " + tag.lastName;
      return fullName.indexOf(term) >= 0;
    });
  }
  timeBetween: number // 1 : giờ | 2 : thứ | 3 : ngày
  /**
   * Tính chênh lệch giữa 2 khoảng thời gian hiện tại và thời gian truyền vào
   * @param dateSent Thời gian muốn tính chênh lệch
   */
  calculateDiff(dateSent) {
    let currentDate = new Date();
    dateSent = new Date(dateSent);
    let dateDiff = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24));
    return dateDiff
  }
  /**
   * Chuyển dữ liệu sang dạng Date()
   * @param date Dữ liệu muốn chuyển
   */
  convertDate(date) {
    return new Date(date);
  }
  /**
   * Hàm xử lý chuyển động giữa các tab
   * @param tabNames id của tab
   */
  openUser(tabNames) {
    var i, tabcontent;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    document.getElementById(tabNames).style.display = "block";
    this.switchtab++;
  }
  /**
   * Hàm test get status của người dùng (Chưa làm được)
   */
  Add() {
    this._userService.getUserOnline(this.token).subscribe((res) => {
      console.log(res)
    })
  }
}

