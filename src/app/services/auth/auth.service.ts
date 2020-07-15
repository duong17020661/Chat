import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { config } from 'rxjs/internal/config';
import { throwError } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private http: HttpClient) { }

    login(username: string, password: string) {
        return this.http.post<any>(`https://localhost:44337/api/users/authenticate/login`, { username, password })
            .pipe(map(user => {
                // User trả về sau khi đăng nhập thành công
                if (user) {
                    // Lưu trữ thông tin người dùng sau khi đăng nhập
                    // và dữ trạng thái đăng nhập khi F5
                    user.authdata = window.btoa(username + ':' + password);
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }

                return user;
            }));
    }

    logout() {
        // Xóa dữ liệu người dùng khỏi localStorage
        localStorage.removeItem('currentUser');
    }

    register(firstName: string, lastName: string, username: string, password: string, email: string, phone: string) {
        console.log(firstName + " " + lastName + " " + username + " " + password + " " + email + " " + phone)
        return this.http.post<any>(`https://localhost:44337/api/users/authenticate/register`, {
            username: username,
            password: password,
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