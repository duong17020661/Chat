import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { filter } from 'jszip';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../../services/users/users.service';
import { IUsers } from 'src/models/users';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {


public users = [];

  spinnerService: any;
  searchTerm: string;
  itemsCopy = [];
  usersID: number;

  // List chứa tất cả dữ liệu về Inbox
  userResource = [];

  constructor(private router: Router, private _userservice: UsersService,private route: ActivatedRoute) {
    
  }

  ngOnInit(): void {
      this._userservice.getUsers().subscribe(data => {
        this.users = data;
        this.userResource = data;
      });
      let id = +this.route.snapshot.firstChild.paramMap.get('id');
      this.usersID = id;
  }

  onSelect(user: IUsers) { 
    this.usersID = user.id;
    user.newMessage = 0;
  }
  onFocus(user: IUsers) {
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

