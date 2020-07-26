import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private http: HttpClient) { }
    /**
     *  Post dữ liệu đăng nhập lên server để xác thực
     * @param username Tên đăng nhập
     * @param password Mật khẩu
     */
    login(username: string, password: string) {
        return this.http.post<any>(`https://localhost:44337/api/authenticate/login`, { username, password })
            .pipe(map(user => {
                // User trả về sau khi đăng nhập thành công
                if (user) {
                    /**
                     * Lưu trữ thông tin người dùng sau khi đăng nhập
                        và dữ trạng thái đăng nhập khi F5
                     */
                    user.authdata = window.btoa(username + ':' + password);
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
                return user;
            }));
    }
    /**
     * Xóa các thông tin về người dùng trên storage khi đăng xuất
     */
    logout() {
        // Xóa dữ liệu người dùng khỏi localStorage
        localStorage.removeItem('currentUser');
        localStorage.removeItem('convId')
    }
    /**
     * Post dữ liệu đăng ký lên server để xác thực
     * @param firstName Họ
     * @param lastName Tên
     * @param username Tên đăng nhập
     * @param password Mật khẩu
     * @param repassword Mật khẩu nhập lại
     * @param email Email
     * @param phone Số điện thoại
     */
    register(firstName: string, lastName: string, username: string, password: string, repassword: string, email: string, phone: string) {
        return this.http.post<any>(`https://localhost:44337/api/authenticate/register`, {
            username: username,
            password: password,
            repassword: repassword,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone
        }).pipe(map(user => {
            // Dữ liệu người dùng nếu đăng nhập thành công
            if (user) {
                // Lưu trữ thông tin người dùng sau khi đăng nhập
                // và dữ trạng thái đăng nhập khi F5
                user.authdata = window.btoa(username + ':' + password);
                localStorage.setItem('currentUser', JSON.stringify(user));
            }
            return user;
        }));
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
}