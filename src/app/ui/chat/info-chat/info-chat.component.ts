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
  public images = [] // List dữ liệu về ảnh
  @Input() message: any; // List dữ liệu về tin nhắn
  public messages: any
  public files = [] // List dữ liệu về dile
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
      this.convId = val.id
      this.getUserId();
      this._chatservice.getFileAndImage(val.id).subscribe((res) => {
        this.messages = res
        this.getFiles();
        this.getImages();
      })
    });
    
  }

  ngOnInit(): void {
    this.modalImg = document.getElementById("img"); // Lấy phần tử Image modal
  }
  // Lấy dữ liệu người dùng
  getConvId(){
    this._datatransfer.Id.subscribe((data) => {
      
    })
  }
  // Lọc dữ liệu tin nhắn ảnh
  getImages(){
    this.images = this.messages.filter(mess => ((mess.type == 2)));
  }
  // Lọc dữ liệu tin nhắn file
  getFiles(){
    this.files = this.messages.filter(mess => ((mess.type == 5)));
  }
  // Theo dõi sự thay đổi và lấy ID
  getUserId(){
    this._datatransfer.getUser$.subscribe(data => {
      this._userservice.getUser(data).subscribe(user => this.user = user)
      this._chatservice.getFileAndImage(this.convId).subscribe((res) => { 
        this.messages = res
        this.getFiles();
        this.getImages();
      })
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
