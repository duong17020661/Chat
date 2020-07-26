import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StringeeService } from '../../services/stringee/stringee.service'
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DatatransferService } from '../../services/datatransfer.service';
import { IUser } from 'src/models/user';
import { UsersService } from 'src/app/services/users/users.service';
import { MessagesService } from 'src/app/services/messages/messages.service';
// Hàm khởi tạo đối tượng File
class FileSpinnet {
  constructor(
    public src: string,
    public file: File,
  ) { }
}
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  title = 'WebChatv2';
  convId: string; // Mã cuộc trò chuyện đang trỏ đến
  editForm: FormGroup; // Form thay đổi thông tin người dùng
  currentUser: any; // Lưu thông tin user hiện tại
  haveAvatar: boolean = true; // Kiểm tra có avatar hay không
  fullName: string; // Tên đầy đử của user
  loginSuccess: boolean = false; // Kiểm tra trạng thái đăng nhập
  user: IUser; // Người dùng đang trỏ đến
  filePath: string = '' // Đường dẫn avatar người dùng
  constructor(
    private _route: ActivatedRoute,
    private _stringeeService: StringeeService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _dataTransfer: DatatransferService,
    private _userService: UsersService,
    private _messagesService: MessagesService

  ) {
    // Tạo lại các đối tượng khi đường dẫn thay đổi
    this._route.params.subscribe((val) => {
      // Tạo edit-form
      this.editForm = this._formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', Validators.required],
      });
      // Get dữ liệu người dùng
      this._dataTransfer.getcurrentUser$.subscribe((res) => {
        this.currentUser = res
      })
    })
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    // Kiểm tra người dùng đăng nhập và có avatar hay không
    if (this.currentUser) {
      this.loginSuccess = true;
      if (this.currentUser.avatar) {
        this.haveAvatar = true;
      }
      else this.haveAvatar = false;
      // Lấy tên đầy đủ của người dùng
      this.fullName = this.currentUser.firstName + " " + this.currentUser.lastName
      this._userService.getUser(this.currentUser.id).subscribe((res) => {
        this.user = res
        console.log(this.user)
      })
    }
    else this.loginSuccess = false;
  }
  /**
   * Xử lý sự kiện khi người dùng đăng xuất
   */
  onLogout() {
    this.loginSuccess = false;
    this._stringeeService.stringeeDisconnect();
    window.location.reload();
  }
  /**
   * Xử lý sự kiện upload avatar
   * @param imageInput Ảnh người dùng chọn
   */
  processFile(imageInput) {
    const file: File = imageInput.files[0];
    var formData = new FormData();
    formData.set('file', file)
    this._messagesService.postFile(formData, JSON.parse(localStorage.getItem('currentUser')).token).subscribe((data) => {
      this.filePath = Object(data).filename
    })
  }
  /**
   * Lấy thông tin từ form
   */
  get update() { return this.editForm.controls; }
  /**
   * Xử lý sự kiện Submit edit-form
   */
  onEdit() {
    console.log(this.update)
    let updateUserData = {
      display_name: this.update.firstName.toString() + " " + this.update.lastName.toString(),
      avatar_url: "",
    }
    this._stringeeService.updateUserInfo(updateUserData)
    this._userService.updateUser(this.currentUser.id, this.update.firstName.value, this.update.lastName.value, this.update.email.value, this.filePath).subscribe()
    alert("Cập nhật thành công!!")
    document.getElementById('edit-profile').style.display = 'none'
  }
}

