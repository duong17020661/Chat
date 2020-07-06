import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { filter } from 'jszip';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../../services/users/users.service';
import { IUsers } from 'src/models/users';
import { map } from 'rxjs/operators';
import { MessagePort } from 'worker_threads';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { DatatransferService } from 'src/app/services/datatransfer.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {


public users = [];
public messages = [];

  spinnerService: any;
  searchTerm: string;
  itemsCopy = [];
  usersID: any;

  // List chứa tất cả dữ liệu về Inbox
  userResource = [];

  constructor(private router: Router,private _chatservice: MessagesService, private _userservice: UsersService,private route: ActivatedRoute, private _datatransfer: DatatransferService) {
    this.getUserID()
  }

  ngOnInit(): void {
    this.getUserID()
    this._userservice.getUsers().pipe(
      map(users => users.sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()))
    ).subscribe(data => {
      this.users = data;
      this.userResource = data;
    });
    this._chatservice.getMessages().pipe(
      map(users => users.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()))
    ).subscribe(data => {
      this.messages = data;
    });
  }

  getLastMessage(user: IUsers){
    for(var i = 0 ; i < this.messages.length; i++){
      if(this.messages[i].receiverID == user.id || this.messages[i].senderID == user.id){
        user.lastMessage = this.messages[i].message;
      }
    }
    return user.lastMessage
  }

  disableNewMessage(userid){
    for(var i = 0 ; i < this.users.length; i++){
      if(this.users[i].id == userid){
        this.users[i].newMessage = 0;
      }
    }
  }

  getUserID(){
    this._datatransfer.userId.subscribe(data => {
      this.usersID = data;
      this.disableNewMessage(data)
    })
  }

  onSelect(user: IUsers) { 
    this.usersID = user.id;
    user.newMessage = 0;
  }

  search(): void {
    let term = this.searchTerm;
    this.users = this.userResource.filter(function(tag) {
        return tag.name.indexOf(term) >= 0;
    }); 
  }

  calculateDiff(dateSent){
    let currentDate = new Date();
    dateSent = new Date(dateSent);
 
     return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) ) /(1000 * 60 * 60 * 24));
   }
  convertDate(date){
    return new Date(date);
  }
  
}

