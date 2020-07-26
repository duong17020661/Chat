import { Component, OnInit, Input } from '@angular/core';
import { MessagesService } from '../../../services/messages/messages.service';
import { ActivatedRoute } from '@angular/router';
import { IMessages } from '../../../../models/messages';
import { UsersService } from '../../../services/users/users.service';
import { IUsers } from 'src/models/users';
import { DatatransferService } from 'src/app/services/datatransfer.service';
import { IUser } from 'src/models/user';
import { StringeeService } from 'src/app/services/stringee/stringee.service';

@Component({
  selector: 'app-info-chat',
  templateUrl: './info-chat.component.html',
  styleUrls: ['./info-chat.component.scss']
})
export class InfoChatComponent implements OnInit {
  public messages: any // List dữ liệu về file và ảnh
  public images = [] // List dữ liệu về ảnh
  public files = [] // List dữ liệu về dile
  public user: IUser; // Dữ liệu về người dùng đang trỏ đến
  public convId; // Mã cuộc trò chuyện đang trỏ đến
  modalImg: any; // Image modal

  constructor(
    private _route: ActivatedRoute,
    private _dataTransferService: DatatransferService,
    private _messageService: MessagesService,
    private _userService: UsersService,
  ) {
    // Tạo lại các đối tượng khi có thay đổi
    this._route.params.subscribe(val => {
      this.convId = val.id
      this.getUserId();
      this._messageService.getFileAndImage(val.id).subscribe((res) => {
        this.messages = res
        this.getFiles();
        this.getImages();
      })
    });

  }

  ngOnInit(): void {
    this.modalImg = document.getElementById("img"); // Lấy phần tử Image modal
  }
  /**
   * Hàm lọc dữ liệu các tin nhắn dạng ảnh
   */
  getImages() {
    this.images = this.messages.filter(mess => ((mess.type == 2)));
  }
  /**
   * Hàm lọc dữ liệu tin nhắn dạng file
   */
  getFiles() {
    this.files = this.messages.filter(mess => ((mess.type == 5)));
  }
  /**
   * Hàm lắng nghe sự thay đỏi về người dùng đang chat
   */
  getUserId() {
    this._dataTransferService.getUser$.subscribe(data => {
      this._userService.getUser(data).subscribe(user => this.user = user)
      this._messageService.getFileAndImage(this.convId).subscribe((res) => {
        this.messages = res
        this.getFiles();
        this.getImages();
      })
    })
  }
  /**
   * Hàm hiển thị file theo dropdown
   * @param isShowFile Hiện/ẩn list file
   */
  isShowFile = false;
  toggleDisplayFile() {
    this.isShowFile = !this.isShowFile;
  }
  /**
   * Hàm hiển thị ảnh theo dropdown
   * @param isShowImg Hiện/ẩn list ảnh
   */
  isShowImg = false;
  toggleDisplayImg() {
    this.isShowImg = !this.isShowImg;
  }
  /**
   * Hàm gán các thuộc tính cho Modal Image
   * @param src Đường dẫn ảnh
   */
  ModalImage(src: string) {
    this.modalImg.src = src;
    this.modalImg.style.width = "auto";
    this.modalImg.style.height = "auto";
  }
}
