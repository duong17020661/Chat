import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../../../services/messages/messages.service';
import { ActivatedRoute } from '@angular/router';
import { IMessages } from '../../../../models/messages';
import { UsersService } from '../../../services/users/users.service';
import { IUsers } from 'src/models/users';
import { DatatransferService } from 'src/app/services/datatransfer.service';

@Component({
  selector: 'app-info-chat',
  templateUrl: './info-chat.component.html',
  styleUrls: ['./info-chat.component.scss']
})
export class InfoChatComponent implements OnInit {
  public images = [] // List dữ liệu về ảnh
  public messages = [] // List dữ liệu về tin nhắn
  public file = [] // List dữ liệu về dile
  public users = []; // List dữ liệu về người dùng
  public usersID; // ID người dùng đang trỏ đến
  modalImg: any; // Image modal
  constructor(private route: ActivatedRoute, private _datatransfer: DatatransferService, private _chatservice: MessagesService, private _userservice: UsersService) {
    // Tạo lại các đối tượng khi có thay đổi
    route.params.subscribe(val => {
    this._userservice.getUsers().subscribe(data => this.users = data);
    this._chatservice.getMessages().subscribe(data => this.images = data);
      
    let id = this.route.snapshot.paramMap.get('id');
    this.usersID = id;
    });
  }

  ngOnInit(): void {
    this.modalImg = document.getElementById("img"); // Lấy phần tử Image modal
    this._userservice.getUsers().subscribe(data => this.users = data); // Lấy dữ liệu người dùng
    this._chatservice.getMessages().subscribe(data => this.messages = data); // Lấy dữ liệu tin nhắn
    // Lấy ID theo url
    let id = this.route.snapshot.paramMap.get('id');
    this.getUserID()
    // Theo dõi sự thay đổi tin nhắn
    this._datatransfer.messages$.subscribe(value =>
      {
        if(value){
          this.messages.push(value)
        }
      });
  }
  // Lọc dữ liệu tin nhắn ảnh
  getImages(){
    return null
    //return this.messages.filter(mess => (mess.type === 'image') && ((mess.senderID === this.usersID) || (mess.receiverID === this.usersID)))
  }
  // Lọc dữ liệu tin nhắn file
  getFiles(){
    return null
    // return this.messages.filter(mess => (mess.type === 'file') && ((mess.senderID === this.usersID) || (mess.receiverID === this.usersID)))
  }
  // Theo dõi sự thay đổi và lấy ID
  getUserID(){
    this._datatransfer.userId.subscribe(data => {
      this.usersID = data;
    })
  }
  // Hiển thị ảnh và file theo dropdown
  isShowFile = false;
  isShowImg = false;
  toggleDisplayFile() {
    this.isShowFile = !this.isShowFile;
  }
  toggleDisplayImg() {
    this.isShowImg = !this.isShowImg;
  }
  // Thêm các thuộc tính cho modal image
  ModalImage(src: string){
    this.modalImg.src = src;
    this.modalImg.style.width = "auto";
    this.modalImg.style.height = "auto";
  }
}
