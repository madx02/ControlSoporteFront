import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidarSesionGuard implements CanActivate {
  constructor(private router: Router){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    const isSessionValid = this.isSessionValid();

    if (!isSessionValid) {
      this.redirectToLogin();
    }

    return isSessionValid;
  }

  private isSessionValid(): boolean {
    const session = localStorage.getItem('x-token');
    if (!session) {
      return false;
    }

    var base64Url = session.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    const token = JSON.parse(window.atob(base64));
    const tokenExp = token.exp * 1000;
    return tokenExp >= Date.now();

  }

  private redirectToLogin(): void {
    this.router.navigate(['/login']);
  }


}
