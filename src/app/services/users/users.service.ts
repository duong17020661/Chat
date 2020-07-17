import { Injectable, } from '@angular/core';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { IUser } from '../../../models/user';
import { identifierModuleUrl } from '@angular/compiler';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }
  @Output() userId = new EventEmitter<string>();
  changeUser(id: string) {
    this.userId.emit(id);
  }
  // Lấy dữ liệu về người dùng
  dataUrl = "https://localhost:44337/api/users"
  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.dataUrl).pipe(retry(3), catchError(this.handleError));
  }
  getUserUrl = "https://localhost:44337/api/users";
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
}
