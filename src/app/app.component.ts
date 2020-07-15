import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StringeeService } from '../app/services/stringee/stringee.service'
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'WebChatv2';
  editForm: FormGroup; // Form thay đổi thông tin người dùng
  currentUser: any; // Lưu thông tin user hiện tại
  haveAvatar: boolean = true; // Kiểm tra có avatar hay không
  fullName: string; // Tên đầy đử của user
  loginSuccess: boolean = false; // Kiểm tra trạng thái đăng nhập
  constructor(
    private route: ActivatedRoute,
    private stringeeService: StringeeService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {

    // Tạo form
    this.editForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });
    // Get dữ liệu người dùng
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // Kiểm tra trạng thái đăng nhập và đường dẫn avatar
    if (this.currentUser) {
      this.loginSuccess = true;
      this.stringeeService.stringeeConnect(this.currentUser.token);
      if (this.currentUser.avatar) {
        this.haveAvatar = true;
      }
      else this.haveAvatar = false;
      this.fullName = this.currentUser.firstName + " " + this.currentUser.lastName
    }
    else this.loginSuccess = false;

    // Lắng nghe trạng thái kết nối với Stringee
    this.stringeeService.onConnect();
    this.stringeeService.onAuthen();
    this.stringeeService.onDisconnect();

  }
  // Xử lý sự kiện Log out
  onLogout() {
    this.loginSuccess = false;
    this.stringeeService.stringeeDisconnect();
  }

  // Edit form
  get update() { return this.editForm.controls; }
  onEdit() {
    let updateUserData = {
      display_name: this.update.firstName.toString() + " " + this.update.lastName.toString(),
      avatar_url: "",
    }
    this.stringeeService.updateUserInfo(updateUserData)
  }


}

