import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StringeeService } from '../app/services/stringee/stringee.service'

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
  constructor(private route: ActivatedRoute, private stringeeService: StringeeService) {
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
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

    // Listen
    this.stringeeService.onConnect();
    this.stringeeService.onAuthen();
    this.stringeeService.onDisconnect();

  }

  onLogout() {
    this.loginSuccess = false;
    this.stringeeService.stringeeDisconnect();
  }


}

