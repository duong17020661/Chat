import { Component, OnInit, ViewChild, ViewChildren, ElementRef, QueryList, Input } from '@angular/core';
import { MessagesService } from '../../../services/messages/messages.service';
import { ActivatedRoute } from '@angular/router';
import { DatatransferService } from 'src/app/services/datatransfer.service';
import { UsersService } from 'src/app/services/users/users.service';
import { StringeeService } from '../../../services/stringee/stringee.service';
import { IUser } from 'src/models/user';
import { debounceTime } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
/**
 * Hàm khởi tạo đối tượng file
 */
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
  public user: IUser; // Dữ liệu về người dùng đang trỏ đến
  modalImg: any; // Image modal
  popup: any; // Popup
  loading: boolean = false; // Hiển thị loading
  typing: boolean = false; // Hiển thị typing
  constructor(
    private _messageService: MessagesService,
    private _route: ActivatedRoute,
    private _userService: UsersService,
    private _dataTransferService: DatatransferService,
    private _stringeeService: StringeeService,
  ) {
    // Tạo lại các đối tượng khi có thay đổi
    this._route.params.subscribe(val => {
      this.convId = val.id;
      this.currentUserId = JSON.parse(localStorage.getItem('currentUser')).id
      this.getUserId()
      this._dataTransferService.changeConv(val.id);
    });
  }

  ngOnInit(): void {
    this.modalImg = document.getElementById("img"); // Lấy phần tử Image modal;
    // Lắng nghe những người dùng đang nhập tin nhắn
    this._stringeeService.stringeeClient.on('userBeginTypingListener', (msg) => {
      this.typing = true; // Lắng nghe sự kiện Keydown
    });
    this._stringeeService.stringeeClient.on('userEndTypingListener', (msg) => {
      this.typing = false; // Lắng nghe sự kiện Keyup
    });
  }
  /**
   * Lắng nghe thay đổi về người dùng và lấy dữ liệu về người dùng theo Id
   */
  getUserId() {
    this._dataTransferService.getUser$.subscribe(data => {
      this._userService.getUser(data).subscribe(user => {
        this.user = user;
        this.getMessages();
      })
    })
  }
  /**
   * Lấy dữ liệu 15 tin nhắn gần nhất
   */
  getMessages() {
    this._stringeeService.getLastMessages(this.convId, (status, code, message, msgs) => {
      this.messages = msgs;
    });
  }
  /**
   * Hàm gửi tin nhắn dạng text
   * @param value Dữ liệu nhập vào
   */
  onEnter(value: string) {
    if (value.trim() != '') {
      this._stringeeService.sendMessage(value, this.convId)
      value = '';
    }
    this.getMessages();
  }
  // Tự động scroll xuống tin nhắn cuối cùng ---------------------------------------------------------
  @ViewChild('scrollframe', { static: false }) scrollFrame: ElementRef;
  @ViewChildren('item') itemElements: QueryList<any>;

  private _scrollContainer: any;
  private _isNearBottom = true;

  ngAfterViewInit() {
    this._scrollContainer = this.scrollFrame.nativeElement;
    this.itemElements.changes.subscribe(_ => this.onItemElementsChanged());
  }
  /**
   * Hàm chạy khi có thay đổi ở Box chat
   */
  private onItemElementsChanged(): void {
    if (this._isNearBottom) {
      this.scrollToBottom();
    }
  }
  /**
   * Tự động scroll xuống dưới cùng
   */
  private scrollToBottom(): void {
    this._scrollContainer.scroll({
      top: this._scrollContainer.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }
  // -----------------------------------------------------------------------------------------------

  selectedFile: FileSpinnet // Khai báo đối tượng File
  /**
   * Hàm xử lý việc gửi tin nhắn dạng ảnh
   * @param imageInput Ảnh được chọn từ input
   */
  processImage(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new FileSpinnet(event.target.result, file);
      var formData = new FormData();
      formData.set('file', file)
      this._messageService.postFile(formData, JSON.parse(localStorage.getItem('currentUser')).token).subscribe((data) => {
        let filePath = Object(data).filename
        this._stringeeService.sendImage(this.convId, filePath)
        this._messageService.postFileToDatabase(this.convId, this.selectedFile.file.name, filePath, 2, "image").subscribe()
      })
    });
    reader.readAsDataURL(file);
  }
  /**
  * Hàm xử lý việc gửi tin nhắn dạng file
  * @param imageInput File được chọn từ input
  */
  processFile(fileInput: any) {
    const file: File = fileInput.files[0];
    let fileType: string;
    fileType = fileInput.files[0].name.split(".").pop() // Lấy đuôi file
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new FileSpinnet(event.target.result, file);
      var formData = new FormData();
      formData.set('file', file)
      this._messageService.postFile(formData, JSON.parse(localStorage.getItem('currentUser')).token).subscribe((data) => {
        let filePath = Object(data).filename
        this._stringeeService.sendFile(this.selectedFile.file.name, this.convId, this.selectedFile.file.name, filePath, file.size)
        this._messageService.postFileToDatabase(this.convId, this.selectedFile.file.name, filePath, 5, fileType).subscribe()
      })
      this.getMessages();
    });
    reader.readAsDataURL(file);

  }
  /**
   * Hàm xử lý khi click vào tin nhắn dạng file
   * @param url Đường dẫn file
   */
  openFile(url: string) {
    window.open(url, "");
  }
  /**
   * Hàm thêm các thuộc tính cho ảnh ở modal
   * @param src Dường dẫn ảnh
   */
  ModalImage(src: string) {
    this.modalImg.src = src;
    this.modalImg.style.width = "auto";
    this.modalImg.style.height = "auto";
  }
  /**
   * Hàm tính khoảng thời gian giữa ngày nhập vào và hiện tại
   * @param dateSent Ngày để so sánh
   */
  calculateDiff(dateSent: string | number | Date) {
    let currentDate = new Date();
    dateSent = new Date(dateSent);
    return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24));
  }
  /**
   * Convert dữ liệu sang dạng Date
   * @param date Ngày cần convert
   */
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
  /**
   * Hàm xử lý phân trang
   */
  onScroll() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 2000);
    // Hàm lấy tin nhắn sau tin nhắn cuối cùng đang hiển thị
    this._stringeeService.stringeeChat.getMessagesBefore(this.convId, this.messages[0].sequence, 15, true, (status, code, message, msgs) => {
      this.messages = msgs.concat(this.messages);
    });
  }
  /**
   * Chỉ cuộn tự động, nếu người dùng đã cuộn đến cuối
   */ 
  private isUserNearBottom(): boolean {
    const threshold = 150;
    const position = this._scrollContainer.scrollTop + this._scrollContainer.offsetHeight;
    const height = this._scrollContainer.scrollHeight;
    return position > height - threshold;
  }
  /**
   * Hàm nhận sự kiện keyup khi người dung typing
   */
  onKeyUp() {
    let info = {
      userId: this.currentUserId,
      convId: this.convId
    }
    //  Tham chiếu html
    const searchBox = document.getElementById('message');
    // streams
    const keyup$ = fromEvent(searchBox, 'keyup');
    // Chờ đợi 5s mới emit
    keyup$
      .pipe(
        debounceTime(500)
      )
      .subscribe(
        () => this._stringeeService.stringeeChat.userEndTyping(info, () =>{})
      );
  }
  /**
   * Hàm nhận sự kiện keydown khi người dung typing
   */
  onKeyDown() {
    let info = {
      userId: this.currentUserId,
      convId: this.convId
    }
    // Gửi tín hiệu người dùng bắt đầu typing
    this._stringeeService.stringeeChat.userBeginTyping(info, function (res) {
      console.log(res)
    })
  }
}

