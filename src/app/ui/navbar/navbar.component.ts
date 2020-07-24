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
  convId: string;
  editForm: FormGroup; // Form thay đổi thông tin người dùng
  currentUser: any; // Lưu thông tin user hiện tại
  haveAvatar: boolean = true; // Kiểm tra có avatar hay không
  fullName: string; // Tên đầy đử của user
  loginSuccess: boolean = false; // Kiểm tra trạng thái đăng nhập
  user: IUser;
  filePath: string = ''
  constructor(
    private route: ActivatedRoute,
    private stringeeService: StringeeService,
    private formBuilder: FormBuilder,
    private router: Router,
    private dataTransfer: DatatransferService,
    private _userService: UsersService,
    private _messagesService: MessagesService

  ) {
    this.route.params.subscribe((val) => {
      // Tạo form
      this.editForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', Validators.required],
      });
      // Get dữ liệu người dùng

      this.dataTransfer.getcurrentUser$.subscribe((res) => {
        this.currentUser = res      
      })

    })
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    if (this.currentUser) {
      this.loginSuccess = true;
      if (this.currentUser.avatar) {
        this.haveAvatar = true;
      }
      else this.haveAvatar = false;
      this.fullName = this.currentUser.firstName + " " + this.currentUser.lastName
      this._userService.getUser(this.currentUser.id).subscribe((res) => {
        this.user = res
        console.log(this.user)
      })
    }
    else this.loginSuccess = false;
  }
  // Xử lý sự kiện Log out
  onLogout() {
    this.loginSuccess = false;
    this.stringeeService.stringeeDisconnect();
    window.location.reload();
  }
  processFile(imageInput){
    const file: File = imageInput.files[0];
    var formData = new FormData();
    formData.set('file', file)
    this._messagesService.postFile(formData, JSON.parse(localStorage.getItem('currentUser')).token).subscribe((data) => {
      this.filePath = Object(data).filename
    })
  }
  // Edit form
  get update() { return this.editForm.controls; }
  onEdit() {
    console.log(this.update)
    let updateUserData = {
      display_name: this.update.firstName.toString() + " " + this.update.lastName.toString(),
      avatar_url: "",
    }
    this.stringeeService.updateUserInfo(updateUserData)
    
    this._userService.updateUser(this.currentUser.id, this.update.firstName.value, this.update.lastName.value, this.update.email.value, this.filePath).subscribe()
  }
}

