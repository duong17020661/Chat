import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StringeeService } from '../../services/stringee/stringee.service'
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DatatransferService } from '../../services/datatransfer.service';

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
  constructor(
    private route: ActivatedRoute,
    private stringeeService: StringeeService,
    private formBuilder: FormBuilder,
    private router: Router,
    private dataTransfer: DatatransferService,

  ) {
    this.route.params.subscribe((val) => {
      // Tạo form
      this.editForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
      });
      // Get dữ liệu người dùng

      this.dataTransfer.getcurrentUser$.subscribe((res) => {
        this.currentUser = res
        console.log(this.currentUser)
        // Kiểm tra trạng thái đăng nhập và đường dẫn avatar
        if (this.currentUser) {
          this.loginSuccess = true;
          if (this.currentUser.avatar) {
            this.haveAvatar = true;
          }
          else this.haveAvatar = false;
          this.fullName = this.currentUser.firstName + " " + this.currentUser.lastName
        }
        else this.loginSuccess = false;
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
    }
    else this.loginSuccess = false;
  }
  // Xử lý sự kiện Log out
  onLogout() {
    this.loginSuccess = false;
    this.stringeeService.stringeeDisconnect();
    window.location.reload();
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

