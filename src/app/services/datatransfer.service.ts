import { Injectable,Component, 
  OnInit, 
  Input, 
  Output, 
  EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IMessages } from '../../models/messages';

@Injectable({
  providedIn: 'root'
})
export class DatatransferService {

  private messages: IMessages;
  messages$ = new BehaviorSubject<IMessages>(this.messages)

  setMessages(message: IMessages){
    this.messages$.next(message)
  }

  @Output() userId = new EventEmitter<number>();
  changeUser(id: number) {
    this.userId.emit(id);
  }

  constructor() { }
}
