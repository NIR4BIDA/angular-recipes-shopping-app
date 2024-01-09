import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../auth/user.model';
import { Router } from '@angular/router';
export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
@Injectable({ providedIn: 'root' })
export class AuthService {
  tokenExpirationTimer = null;
  user = new BehaviorSubject<User>(null);
  constructor(private http: HttpClient, private router: Router) {}
  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyClUFds90-zuEDKc5R2NeO1zv7X53Wjots',
        { email, password, returnSecureToken: true }
      )
      .pipe(
        catchError(this.handleCatchError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.idToken,
            +resData.expiresIn,
            resData.localId
          );
        })
      );
  }
  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyClUFds90-zuEDKc5R2NeO1zv7X53Wjots',
        { email, password, returnSecureToken: true }
      )
      .pipe(
        catchError(this.handleCatchError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.idToken,
            +resData.expiresIn,
            resData.localId
          );
        })
      );
  }
  private handleCatchError(errorRes) {
    let errorMsg = 'unknown message';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMsg);
    }
    console.log(errorRes.error.error.message);
    if (errorRes.error.error.message === 'EMAIL_EXISTS') {
      errorMsg = 'email exists already';
    } else if (errorRes.error.error.message === 'INVALID_LOGIN_CREDENTIALS') {
      errorMsg = 'invalid login cradentials';
    }
    return throwError(errorMsg);
  }
  private handleAuthentication(
    email: string,
    token: string,
    expiresIn: number,
    userId: string
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }
  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }
  autoLogout(time) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, time);
  }
  autoLogin() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const user = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tikenExpirationDate)
    );
    if (user.token) {
      this.user.next(user);
      const expireDuration =
        new Date(userData._tikenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expireDuration);
    }
  }
}
