import { Component, OnInit } from '@angular/core';
import { StringeeService } from '../services/stringee/stringee.service';

@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.scss']
})
export class UiComponent implements OnInit {
  currentUser: any;

  constructor(private stringeeService: StringeeService) { 
    
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.stringeeService.stringeeConnect(this.currentUser.token);
  }

}
