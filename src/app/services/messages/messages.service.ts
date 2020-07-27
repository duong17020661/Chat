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
  /**
   * Lưu file lên Stringee server
   * @param file File muốn lưu trên server
   * @param token Token để xác thực người dùng
   */
  postFile(file: FormData, token: string) {
    // Header của request
    const httpOptions = {
      headers: new HttpHeaders({
        'X-STRINGEE-AUTH': token,
      })
    };
    return this.http.post(`https://api.stringee.com/v1/file/upload?uploadType=multipart`, file, httpOptions);
  }
  /**
   * Lưu file trên server của bản thân
   * @param convId Mã cuộc trò chuyện
   * @param content Nội dung
   * @param filePath Đường dẫn file
   * @param type Kiểu
   * @param typeOf Đuôi file
   */
  postFileToDatabase(convId: string, content: string, filePath: string, type: number, typeOf: string) {
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
  /**
   * Hàm lấy thông tin tất các file và ảnh từ server của bản thân
   * @param convId Mã cuộc trò chuyện
   */
  getFileAndImage(convId: string) {
    return this.http.get<any>('https://localhost:44337/api/Files/' + convId)
  }
  /**
   * Hàm lấy thông tin tất các file từ server của bản thân
   * @param convId Mã cuộc trò chuyện
   */
  getAllFiles(convId: string) {
    return this.http.get<any>('https://localhost:44337/api/Files/getAllFile?convId=' + convId)
  }
  /**
   * Hàm lấy thông tin tất các ảnh từ server của bản thân
   * @param convId Mã cuộc trò chuyện
   */
  getAllImages(convId: string) {
    return this.http.get<any>('https://localhost:44337/api/Files/getAllImage?convId=' + convId)
  }
  /**
   * Hàm lấy thông tin 2 file từ server của bản thân
   * @param convId Mã cuộc trò chuyện
   */
  getFile(convId: string) {
    return this.http.get<any>('https://localhost:44337/api/Files/getFiles?convId=' + convId)
  }
  /**
   * Hàm lấy thông tin 3 ảnh từ server của bản thân
   * @param convId Mã cuộc trò chuyện
   */
  getImage(convId: string) {
    return this.http.get<any>('https://localhost:44337/api/Files/getImages?convId=' + convId)
  }
}
