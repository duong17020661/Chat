import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('currentUser')) {
            // Trả về true khi đăng nhập thành công
            return true;
        }
        // Nếu đăng nhập không thành công trả về đường dẫn cũ
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }

}