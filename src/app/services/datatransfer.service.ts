import {
  Injectable, Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IMessages } from '../../models/messages';

@Injectable({
  providedIn: 'root'
})
export class DatatransferService {

  private messages: IMessages;
  messages$ = new BehaviorSubject<IMessages>(this.messages)
  
  // Thêm tin nhắn sau khi có tin nhắn mới được tạo
  setMessages(message: IMessages) {
    this.messages$.next(message)
  }

  // Nhận ID khi có sự kiện thay đổi user
  @Output() Id = new EventEmitter<{conv: string, user: string}>();
  changeConv(conID: string, UseID: string) {
    this.Id.emit({conv: conID,user: UseID});
  }
  constructor() { }
}
