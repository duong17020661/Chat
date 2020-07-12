import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'WebChatv2';

  currentUser: any;
  haveAvatar: boolean = true;
  fullName: string;
  loginSuccess: boolean = false;
  constructor(private route: ActivatedRoute) {
    route.params.subscribe(val => {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (this.currentUser) {
        this.loginSuccess = true;
        if (this.currentUser.avatar) {
          this.haveAvatar = true;
        }
        else this.haveAvatar = false;
        this.fullName = this.currentUser.firstName + " " + this.currentUser.lastName
      }
      else this.loginSuccess = false;
      console.log(this.currentUser)
    });
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
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

  onLogout() {
    this.loginSuccess = false;
  }


}

