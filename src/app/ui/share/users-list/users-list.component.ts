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
    user.status = false;
  }

  search(): void {
    let term = this.searchTerm;
    this.users = this.userResource.filter(function(tag) {
        return tag.name.indexOf(term) >= 0;
    }); 
  }
  
}

