import { Component, OnInit, ViewChild, ViewChildren, ElementRef, QueryList, Input } from '@angular/core';
import { MessagesService } from '../../../services/messages/messages.service';
import { ActivatedRoute } from '@angular/router';
import { DatatransferService } from 'src/app/services/datatransfer.service';
import { UsersService } from 'src/app/services/users/users.service';
import { StringeeService } from '../../../services/stringee/stringee.service';
import { IUser } from 'src/models/user';
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
  @Input() messages: any; // List dữ liệu về các tin nhắn
  public users = [];// List dữ liệu về người dùng
  public user: IUser;
  modalImg: any; // Image modal
  popup: any; // Popup
  loading: boolean = false;
  private _userservice: any;
  constructor(
    private _chatservice: MessagesService,
    private route: ActivatedRoute,
    private _users: UsersService,
    private _datatransfer: DatatransferService,
    private stringeeService: StringeeService,
    private messageService: MessagesService
  ) {
    // Tạo lại các đối tượng khi có thay đổi
    this.route.params.subscribe(val => {
      this.convId = val.id;
      this.currentUserId = JSON.parse(localStorage.getItem('currentUser')).id
      this.getUserId()
    });

  }

  ngOnInit(): void {
    this.modalImg = document.getElementById("img"); // Lấy phần tử Image modal;
  }
  getUserId() {
    this._datatransfer.getUser$.subscribe(data => {
      this._users.getUser(data).subscribe(user => {
        this.user = user;
        this.getConvesationLast();
      })
    })
  }
  // Lấy dữ liệu 25 tin nhắn gần nhất
  getConvesationLast() {
    this.stringeeService.getLastMessages(this.convId, (status, code, message, msgs) => {
      this.messages = msgs;
    });
  }

  // Hàm xử lý sự kiện Enter khi nhập dữ liệu
  onEnter(value: string) {
    if (value) {
      this.stringeeService.sendMessage(value, this.convId)
      value = '';
    }
    this._datatransfer.changeConv(this.convId)
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
      var formData = new FormData();
      formData.set('file', file)
      this._chatservice.postFile(formData, JSON.parse(localStorage.getItem('currentUser')).token).subscribe((data) => {
        let filePath = Object(data).filename
        this.stringeeService.sendImage(this.convId, filePath)
        this.messageService.postFileToDatabase(this.convId, this.selectedFile.file.name, filePath, 2, "image").subscribe()
      })
    });
    reader.readAsDataURL(file);


  }
  // Xử lý sự kiện upload file
  processFile(fileInput: any) {
    const file: File = fileInput.files[0];
    let fileType: string;
    fileType = fileInput.files[0].name.split(".").pop() // Lấy đuôi file
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new FileSpinnet(event.target.result, file);
      var formData = new FormData();
      formData.set('file', file)
      this._chatservice.postFile(formData, JSON.parse(localStorage.getItem('currentUser')).token).subscribe((data) => {
        let filePath = Object(data).filename
        this.stringeeService.sendFile(this.selectedFile.file.name, this.convId, this.selectedFile.file.name, filePath, file.size)
        this.messageService.postFileToDatabase(this.convId, this.selectedFile.file.name, filePath, 5, fileType).subscribe()
      })
      this.getConvesationLast();
    });
    reader.readAsDataURL(file);

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
  direction = ''
  onScroll() {
    console.log('scrolled up!');
    this.loading = true;
    this.stringeeService.stringeeChat.getMessagesBefore(this.convId, this.messages[0].sequence, 15, true, (status, code, message, msgs) => {
      this.messages = msgs.concat(this.messages);
      setTimeout(() => {
        this.loading = false;
      }, 3000);

    });
    this.direction = 'up';
  }
}

