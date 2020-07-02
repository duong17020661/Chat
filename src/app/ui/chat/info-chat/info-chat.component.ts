import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../../../services/messages/messages.service';
import { ActivatedRoute } from '@angular/router';
import { IMessages } from '../../../../models/messages';
import { UsersService } from '../../../services/users/users.service';
import { IUsers } from 'src/models/users';
import { DatatransferService } from 'src/app/services/datatransfer.service';

@Component({
  selector: 'app-info-chat',
  templateUrl: './info-chat.component.html',
  styleUrls: ['./info-chat.component.scss']
})
export class InfoChatComponent implements OnInit {
  public images = []
  public users = [];
  public usersID;
  modalImg: any;
  constructor(private route: ActivatedRoute, private _datatransfer: DatatransferService, private _chatservice: MessagesService, private _userservice: UsersService) {
    route.params.subscribe(val => {
    this._userservice.getUsers().subscribe(data => this.users = data);
    this._chatservice.getMessages().subscribe(data => this.images = data);
    let id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.usersID = id;
    });
  }

  ngOnInit(): void {
    this.modalImg = document.getElementById("img");
    this._userservice.getUsers().subscribe(data => this.users = data);
    this._chatservice.getMessages().subscribe(data => this.images = data);
    let id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.usersID = id;
    this._datatransfer.messages$.subscribe(value =>
      {
        if(value){
          this.images.push(value)
        }
          // do something
      });
  }

  isShowFile = false;
  isShowImg = false;
  
  toggleDisplayFile() {
    this.isShowFile = !this.isShowFile;
  }
  toggleDisplayImg() {
    this.isShowImg = !this.isShowImg;
  }

  ModalImage(src: string){
    this.modalImg.src = src;
    this.modalImg.style.width = "auto";
    this.modalImg.style.height = "auto";
  }
}
