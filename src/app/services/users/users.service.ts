import { Injectable, } from '@angular/core';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { IUser } from '../../../models/user';
import { identifierModuleUrl } from '@angular/compiler';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }
  // Đường dẫn để thực hiện các thao tác với dữ liệu của người dùng
  dataUrl = "https://localhost:44337/api/users"
  /**
   * Hàm lấy thông tin tất cả người dùng
   */
  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.dataUrl).pipe(retry(3), catchError(this.handleError));
  }
  /**
   * Hàm lấy thông tin 1 người dùng theo Id
   * @param id ID người muốn lấy thông tin
   */
  getUser(id: string): Observable<IUser> {
    return this.http.get<IUser>(this.dataUrl + "/" + id).pipe(retry(3), catchError(this.handleError));
  }

  /**
     * Hàm xử lý và trả về các lỗi khi sử dụng trao đổi dữ liệu qua http
     * @param error 
     */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Xảy ra khi có lỗi bên phía Client
      console.error('An error occurred:', error.error.message);
    } else {
      // Mã phía backend trả về khi không thành công
      // Response trả về từ server
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
  /**
   * Hàm lấy thông tin online của người dùng ( chưa làm được )
   * @param token Token người dùng
   */
  getUserOnline(token: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'X-STRINGEE-AUTH': token,
      })
    };
    const params = {
      page: 1,
      limit: 100,
      attribute: "111",
      userId: "08d82d1a-b0d4-40e0-8ea8-f68abff2e607"
    }
    return this.http.post(`https://api.stringee.com/v1/users`, params, httpOptions);
  }
  /**
   * Hàm cập nhật thông tin của người dùng lên server của bản thân
   * @param id Mã người dùng
   * @param fName Họ
   * @param lName tên
   * @param email Email
   * @param ava Ảnh đại diện
   */
  updateUser(id: string, fName: string, lName: string, email: string, ava: string) {
    const options = {
      firstName: fName,
      lastName: lName,
      email: email,
      avatar: ava
    }
    console.log(options)
    return this.http.put<any>('https://localhost:44337/api/users/' + id, options)
  }
}
