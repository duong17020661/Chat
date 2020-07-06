import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users/users.service';
import { DatatransferService } from 'src/app/services/datatransfer.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  public usersID;
  constructor(private route: ActivatedRoute, private _userservice: UsersService, private datatransfer: DatatransferService) {
    route.params.subscribe(val => {
      this._userservice.getUsers().subscribe(data => this.users = data);
      let id = parseInt(this.route.snapshot.paramMap.get('id'));
      this.usersID = id;
      this.datatransfer.changeUser(this.usersID)
    });
  }

  ngOnInit(): void {
    this._userservice.getUsers().subscribe(data => this.users = data);
    let id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.usersID = id;
  }
  isShowDivIf = false;
  
  toggleDisplayDivIf() {
    this.isShowDivIf = !this.isShowDivIf;
    if(!this.isShowDivIf) {
      document.getElementById("c4").style.width = "calc(100% - 300px)";
    }
    else {
      document.getElementById("c4").style.width = "100%";
    }
  }

  timeDiff(dateSent){
    let currentDate = new Date();
    dateSent = new Date(dateSent);
 
     return Math.floor((currentDate.getTime() - dateSent.getTime())/(1000 * 60));
   }

  public users = []
  
}

