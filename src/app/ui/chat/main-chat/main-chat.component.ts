import { Component, OnInit, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { MessagesService } from '../../../services/messages/messages.service';
import { ActivatedRoute } from '@angular/router';
import { IMessages } from '../../../../models/messages';
import { DatatransferService } from 'src/app/services/datatransfer.service';
import { UsersService } from 'src/app/services/users/users.service';
import { map } from 'rxjs/internal/operators/map';
import { StringeeService } from '../../../services/stringee/stringee.service';
import { IUser } from 'src/models/user';
import { filter } from 'jszip';
import { stringify } from 'querystring';
// Hàm khởi tạo đối tượng File
class FileSpinnet {
  constructor(
    public src: string,
    public file: File,
  ) { }
}

@Component({
  selector: 'app-main-chat',
  templateUrl: './main-chat.component.html',
  styleUrls: ['./main-chat.component.scss']
})
export class MainChatComponent implements OnInit {

  public convId: string; // ID cuôc trò chuyện đang được trỏ đến
  public userId: string; // ID người dùng đang được trỏ đến
  public currentUserId: string; // ID người dùng hiện tại
  public messages: any[]; // List dữ liệu về các tin nhắn
  public users = [];// List dữ liệu về người dùng
  public user: IUser;
  modalImg: any; // Image modal
  popup: any; // Popup
  id = "08d825b9-3599-46a2-89cd-ced2df8bfa9e"
  loading: boolean = false;
  constructor(
    private _chatservice: MessagesService,
    private route: ActivatedRoute,
    private _users: UsersService,
    private _datatransfer: DatatransferService,
    private stringeeservices: StringeeService
  ) {
    // Tạo lại các đối tượng khi có thay đổi
    route.params.subscribe(val => {
      this.stringeeservices.stringeeChat.on('onObjectChange', (info) => {
        this.getConvesationLast();
        this.stringeeservices.getConversation((status, code, message, convs) => {
          // this.conversation = convs;
        });
      });
      this.convId = val.id;
      this.loading = true;
      this.currentUserId = JSON.parse(localStorage.getItem('currentUser')).id
      this.getUserId()
      this.getConvId()
      this.loading = false;
      this._users.getUsers().subscribe(data => this.users = data);
    });

  }

  ngOnInit(): void {
    this.modalImg = document.getElementById("img"); // Lấy phần tử Image modal;
  }
  // Hàm lấy ID đang trỏ đến
  getConvId() {
    this._datatransfer.Id.subscribe(data => {
      this.convId = data.conv;
      this.getConvesationLast();  
    })
  }
  getUserId(){
    this._datatransfer.Id.subscribe(data => {
      this._users.getUser(data.user).subscribe(user => this.user = user)
    })
  }
  // Lấy dữ liệu 25 tin nhắn gần nhất
  getConvesationLast() {
    this.stringeeservices.getLastMessages(this.convId, (status, code, message, msgs) => {
      this.messages = msgs;
    });
  }

  // Hàm xử lý sự kiện Enter khi nhập dữ liệu
  onEnter(value: string) {
    if (value) {
      this.stringeeservices.sendMessage(value, this.convId)
      value = '';
    }
    this.getConvesationLast();
  }
  // Thêm thời gian hoạt động người dùng vào dữ liệu tin nhắn
  addTimeDiff(messages: string | any[]) {
    for (let i = 0; i < messages.length - 1; i++) {
      //   messages[i].timeDiff = this.timeBetween(this.messages[i].time, this.messages[i + 1].time)
    }
  }
  // Tự động scroll xuống tin nhắn cuối cùng
  @ViewChild('scrollframe', { static: false }) scrollFrame: ElementRef;
  @ViewChildren('item') itemElements: QueryList<any>;

  private scrollContainer: any;
  private items = [];

  ngAfterViewInit() {
    this.scrollContainer = this.scrollFrame.nativeElement;
    this.itemElements.changes.subscribe(_ => this.onItemElementsChanged());

    // Add a new item every 2 seconds
    setInterval(() => {
      this.items.push({});
    }, 2000);
  }

  private onItemElementsChanged(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }
  // ----

  selectedFile: FileSpinnet // Khai báo đối tượng File
  // Xử lý sự kiện upload ảnh
  processImage(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new FileSpinnet(event.target.result, file);
      var fileMsg = {
        type: 2,
        convId: this.convId,
        message: {
          content: "",
          photo: {
            filePath: this.selectedFile.src,
            thumbnail: "",
            ratio: ""
          },
          data: {
            key: 'value'
          }
        }
      };
      this.stringeeservices.stringeeChat.sendMessage(fileMsg, function (status, code, message, msg) {
        console.log(status + code + message + "msg result " + JSON.stringify(msg));
      });
    });
    reader.readAsDataURL(file);


  }
  // Xử lý sự kiện upload file
  processFile(fileInput: any) {
    const file: File = fileInput.files[0];
    let fileType: string;
    fileType = fileInput.files[0].name.split(".").pop() // Lấy đuôi file
    const reader = new FileReader();
    reader.addEventListener('load', async (event: any) => {
      this.selectedFile = new FileSpinnet(event.target.result, file);
      var formData = new FormData();
      formData.set('file', file)
      let fPath = await this.saveFileToServer(formData, JSON.parse(localStorage.getItem('currentUser')).token);
      console.log(JSON.stringify(fPath))
      this.stringeeservices.sendFile(this.selectedFile.file.name, this.convId, this.selectedFile.file.name, this.selectedFile.src, file.size)
      this.getConvesationLast();
    });
    reader.readAsDataURL(file);

  }

  saveFileToServer(data,token) {
    return this._chatservice.postFile(data,token)
}

  // Xử lý sự kiện click tin nhắn dạng file
  openFile(url: string) {
    window.open(url, "");
  }
  // Thêm các thuộc tính cho modal image
  ModalImage(src: string) {
    this.modalImg.src = src;
    this.modalImg.style.width = "auto";
    this.modalImg.style.height = "auto";
  }
  // Tính sự chênh lệch giữa 2 khoảng thời gian theo ngày
  calculateDiff(dateSent: string | number | Date) {
    let currentDate = new Date();
    dateSent = new Date(dateSent);
    return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24));
  }
  // Đổi kiểu dữ liệu sang Date()
  convertDate(date: string | number | Date) {
    return new Date(date);
  }

  PopupIcon: boolean = false // Popup Icon
  // Hiển thị Popup Icon
  showPopupIcon() {
    if (this.PopupIcon) {
      this.PopupIcon = false;
    }
    else {
      this.PopupIcon = true;
    }
  }
  // Tính khoảng thời gian giữa 2 tin nhắn
  timeBetween(dateSent1: string | number | Date, dateSent2: string | number | Date) {
    dateSent1 = new Date(dateSent1);
    dateSent2 = new Date(dateSent2);
    return (dateSent2.getTime() - dateSent1.getTime()) / (1000 * 60);
  }

}
