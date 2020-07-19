import { Component, OnInit } from '@angular/core';
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
  public images = [] // List dữ liệu về ảnh
  public messages = [] // List dữ liệu về tin nhắn
  public file = [] // List dữ liệu về dile
  public user: IUser; // List dữ liệu về người dùng
  public convId; // ID người dùng đang trỏ đến
  modalImg: any; // Image modal
  
  constructor(
    private route: ActivatedRoute, 
    private _datatransfer: DatatransferService, 
    private _chatservice: MessagesService, 
    private _userservice: UsersService,
    private stringeeservices: StringeeService,
    ) {
    // Tạo lại các đối tượng khi có thay đổi
    route.params.subscribe(val => {
     // this.convId = val.id;
          // Lấy ID theo url
          console.log("___________________________________")
      this.getUserId();
      this.getConvId();
      console.log("+++++++++++++++++++++++++++++++++++")
    });
  }

  ngOnInit(): void {
    this.modalImg = document.getElementById("img"); // Lấy phần tử Image modal

    // Theo dõi sự thay đổi tin nhắn

    this._datatransfer.messages$.subscribe(value =>
      {
        if(value){
          this.messages.push(value)
        }
      });
  }
  // Lấy dữ liệu người dùng
  getUser(convId){

  }

  getConvId() {
    this._datatransfer.Id.subscribe(data => {
      this.convId = data.conv;
      this.getConvesationLast();  
    })
  }
  getConvesationLast() {
    this.stringeeservices.getLastMessages(this.convId, (status, code, message, msgs) => {
      this.messages = msgs;
      console.log(this.messages)
    });
  }

  // Lọc dữ liệu tin nhắn ảnh
  getImages(){
    return this.messages.filter(mess => ((mess.type == 2)));
  }
  // Lọc dữ liệu tin nhắn file
  getFiles(){
    return this.messages.filter(mess => ((mess.type == 5)));
  }
  // Theo dõi sự thay đổi và lấy ID
  getUserId(){
    this._datatransfer.Id.subscribe(data => {
      this._userservice.getUser(data.user).subscribe(user => this.user = user)
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
