import {
  Injectable, Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IMessages } from '../../models/messages';

@Injectable({
  providedIn: 'root'
})
export class DatatransferService {

  private messages: any;
  messages$ = new BehaviorSubject<any>(this.messages)
  
  // Thêm tin nhắn sau khi có tin nhắn mới được tạo
  setMessages(message: any) {
    this.messages$.next(message)
  }

  // Nhận ID khi có sự kiện thay đổi user
  @Output() Id = new EventEmitter<string>();
  changeConv(conID: string) {
    this.Id.emit(conID);
  }

  private _getUser: BehaviorSubject<string> = new BehaviorSubject<string>('');
  getUser$: Observable<string> = this._getUser.asObservable();

  setUser(userTranfer: any) {
    this._getUser.next(userTranfer);
  }
  constructor() { }
}
