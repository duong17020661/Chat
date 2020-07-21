import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { IMessages } from '../../../models/messages';
import { IUser } from 'src/models/user';
import { Guid } from "guid-typescript";

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private http: HttpClient) { }
  // Lấy dữ liệu nội dung tin nhắn
  dataUrl = "/assets/JsonData/messages.json"
  getMessages(): Observable<IMessages[]> {
    return this.http.get<IMessages[]>(this.dataUrl).pipe(retry(3),catchError(this.handleError));
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


  postFile(file: FormData, token: string) {
      const httpOptions = {
        headers: new HttpHeaders({
          'X-STRINGEE-AUTH': token,
        })
      };
    return this.http.post(`https://api.stringee.com/v1/file/upload?uploadType=multipart`,file ,httpOptions);
}
  postFileToDatabase(convId: string, content: string, filePath: string, type: number, typeOf: string){
    var options = {
        Id: Object(Guid.create()).value,
        convId: convId,
        content: content,
        filePath: filePath,
        type: type,
        typeOf: typeOf
    }
    console.log(options)
    return this.http.post<any>('https://localhost:44337/api/Files', options)
  }

}
