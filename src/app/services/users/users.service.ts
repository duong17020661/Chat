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
  // Lấy dữ liệu về người dùng
  dataUrl = "https://localhost:44337/api/users"
  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.dataUrl).pipe(retry(3), catchError(this.handleError));
  }
  getUser(id: string): Observable<IUser> {
    return this.http.get<IUser>(this.dataUrl + "/" + id).pipe(retry(3), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

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
  return this.http.post(`https://api.stringee.com/v1/users`,params ,httpOptions);
}
  updateUser(id: string, fName: string, lName: string, email: string, ava: string){
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
