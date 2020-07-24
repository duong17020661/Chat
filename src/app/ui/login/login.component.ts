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
  returnUrl: string;
  error = '';
  users = [];
  switch: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthService,
    private stringeeService: StringeeService,
    private dataTransfer: DatatransferService,
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      repassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required, Validators.pattern("((09|03|07|08|05)+([0-9]{8}))")],
    });

    // Reset trạng thái đăng nhập
    this.authenticationService.logout();
  }

  // Get dữ liệu từ input text trong form đăng nhập
  get f() { return this.loginForm.controls; }
  // Xử lý sự kiện Đăng nhập
  onSubmit() {
    this.submitted = true;
    // Dừng lại khi form bị lỗi
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.dataTransfer.setCurrentUser(data);
          this.router.navigate([this.route.snapshot.queryParams['returnUrl'] || '/chat/' + 'conv-vn-1-NO20OWUHMD-1594421844878']);
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }

  // Get dữ liệu từ input text trong form đăng ký
  get rf() { return this.registerForm.controls; }
  // Xử lý sự kiện Đăng ký
  register() {
    if (this.registerForm.invalid) {
      return;
    }
    this.submitted = true;
    this.loading = true;

    this.authenticationService.register(this.rf.firstName.value, this.rf.lastName.value, this.rf.username.value, this.rf.password.value, this.rf.repassword.value, this.rf.email.value, this.rf.phone.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.route.snapshot.queryParams['returnUrl'] || '/chat/' + 'conv-vn-1-NO20OWUHMD-1594421844878']);
        },
        error => {
          this.error = error;
          this.loading = false;
        });
  }

  switchRegister() {
    this.switch = true
  }
  switchLogin() {
    this.switch = false
  }

}