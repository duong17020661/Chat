import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users/users.service';
import { DatatransferService } from 'src/app/services/datatransfer.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  public users = [] // Danh sách dữ liệu người dùng
  public usersID; // ID người dùng đang được trỏ đến
  constructor(private route: ActivatedRoute, private _userservice: UsersService, private datatransfer: DatatransferService) {
    // Tạo lại các đối tượng khi có thay đổi
    route.params.subscribe(val => {
      this._userservice.getUsers().subscribe(data => this.users = data);
      let id = this.route.snapshot.paramMap.get('id');
      this.usersID = id;
      this._userservice.changeUser(this.usersID)
    });
  }

  ngOnInit(): void {
    // Lấy dữ liệu người dùng
    this._userservice.getUsers().subscribe(data => this.users = data);
    // Lấy ID từ url
    let id = this.route.snapshot.paramMap.get('id');
    this.usersID = id;
  }

  isShowDivIf = false; // Hiện/đóng thông tin cuộc trò chuyện

  // Xử lý hiện và đóng thông tin cuộc trò chuyện
  toggleDisplayDivIf() {
    this.isShowDivIf = !this.isShowDivIf;
    if (!this.isShowDivIf) {
      document.getElementById("c4").style.width = "calc(100% - 300px)";
    }
    else {
      document.getElementById("c4").style.width = "100%";
    }
  }
  
  // Tính chênh lệch giữa 2 khoảng thời gian theo phút
  timeDiff(dateSent) {
    let currentDate = new Date();
    dateSent = new Date(dateSent);
    return Math.floor((currentDate.getTime() - dateSent.getTime()) / (1000 * 60));
  }
}

