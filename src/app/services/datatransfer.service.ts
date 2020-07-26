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
  /**
   * Hàm cập nhật dữ liệu tin nhắn khi có tin nhắn mới được gửi
   * @param message 
   */
  setMessages(message: any) {
    this.messages$.next(message)
  }
  /**
   * Lắng nghe sự thay đổi khi chọn vào các cuộc trò chuyện mới
   * sau đó truyền dữ liệu về mã cuộc trò chuyện
   * @param convId Mã cuộc trò chuyện sau khi thay đổi
   * @param Id Mã cuộc trò chuyện đang lắng nghe
   */
  @Output() Id = new EventEmitter<string>();
  changeConv(convId: string) {
    this.Id.emit(convId);
  }
  /**
  * Lắng nghe sự thay đổi khi chọn vào các cuộc trò chuyện mới
  * sau đó truyền dữ liệu về người dùng
  * @param _getUser Mã người dùng đang lắng nghe
  * @param userTranfer Mã người dùng sau khi thay đổi 
  */
  private _getUser: BehaviorSubject<string> = new BehaviorSubject<string>('');
  getUser$: Observable<string> = this._getUser.asObservable();

  setUser(userTranfer: any) {
    this._getUser.next(userTranfer);
  }
  /**
   * Lắng nghe sự thay đổi khi đăng nhập vào ứng dụng
   * sau đó truyền dữ liệu về người dùng hiện tại
   * @param _getCurrentUser Mã người dùng hiện tại đang lắng nghe
   * @param userTranfer Mã người dùng hiện tại sau khi thay đổi 
   */
  private _getCurrentUser: BehaviorSubject<any> = new BehaviorSubject<any>('');
  getcurrentUser$: Observable<any> = this._getCurrentUser.asObservable();

  setCurrentUser(userTranfer: any) {
    this._getCurrentUser.next(userTranfer);
  }
  constructor() { }
}
