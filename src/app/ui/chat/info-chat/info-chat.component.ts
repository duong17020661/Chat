import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../../../services/messages/messages.service';
import { ActivatedRoute } from '@angular/router';
import { IMessages } from '../../../../models/messages';
import { UsersService } from '../../../services/users/users.service';
import { IUsers } from 'src/models/users';

@Component({
  selector: 'app-info-chat',
  templateUrl: './info-chat.component.html',
  styleUrls: ['./info-chat.component.scss']
})
export class InfoChatComponent implements OnInit {

  public images = []
  public users = [];
  public usersID;
  constructor(private route: ActivatedRoute, private _chatservice: MessagesService, private _userservice: UsersService) {
    route.params.subscribe(val => {
    this._userservice.getUsers().subscribe(data => this.users = data);
    this._chatservice.getMessages().subscribe(data => this.images = data);
    let id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.usersID = id;
    });
  }

  ngOnInit(): void {
    this._userservice.getUsers().subscribe(data => this.users = data);
    this._chatservice.getMessages().subscribe(data => this.images = data);
    let id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.usersID = id;
  }

  isShowFile = false;
  isShowImg = false;
  
  toggleDisplayFile() {
    this.isShowFile = !this.isShowFile;
  }
  toggleDisplayImg() {
    this.isShowImg = !this.isShowImg;
  }
}
