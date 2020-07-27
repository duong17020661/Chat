import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StringeeService } from '../../services/stringee/stringee.service'
import { DatatransferService } from 'src/app/services/datatransfer.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  rSubmitted = false;
  returnUrl: string;
  errorlogin = '';
  errorregister = '';
  
  users = [];
  switch: boolean = true;

  constructor(
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _authenticationService: AuthService,
    private _stringeeService: StringeeService,
    private _dataTransfer: DatatransferService,
  ) { }

  ngOnInit() {
    this.loginForm = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.registerForm = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      repassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required, Validators.pattern("((09|03|07|08|05)+([0-9]{8}))")],
    });

    // Reset trạng thái đăng nhập
    this._authenticationService.logout();
  }

  // Get dữ liệu từ input text trong form đăng nhập
  get f() { return this.loginForm.controls; }
  /**
   * Xử lý sự kiện submit khi đăng nhập
   */
  onSubmit() {
    this.submitted = true;
    // Dừng lại khi form bị lỗi
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this._authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this._dataTransfer.setCurrentUser(data);
          this._router.navigate([this._route.snapshot.queryParams['returnUrl'] || '/chat/' + 'newuser']);
        },
        error => {
          this.errorlogin = error;
          this.loading = false;
        });
  }

  // Get dữ liệu từ input text trong form đăng ký
  get rf() { return this.registerForm.controls; }
  /**
   * Xử lý sự kiện submit khi đăng ký
   */
  register() {
    this.rSubmitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    this._authenticationService.register(this.rf.firstName.value, this.rf.lastName.value, this.rf.username.value, this.rf.password.value, this.rf.repassword.value, this.rf.email.value, this.rf.phone.value)
      .pipe(first())
      .subscribe(
        data => {
          alert("Đăng ký thành công!!!!!!")
          this._router.navigate([this._route.snapshot.queryParams['returnUrl'] || '/chat/' + 'newuser']);
        },
        error => {
          this.errorregister = error;
          this.loading = false;
        });
  }
  /**
   * Sự kiện qua lại giữa 2 tab Đăng nhập và Đăng ký
   */
  switchRegister() {
    this.switch = true
  }
  switchLogin() {
    this.switch = false
  }

}