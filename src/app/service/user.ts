import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { CustomHttpResponse, ProfileState } from '../interface/appstates';
import { Key } from '../enum/key.enum';
import { User } from '../interface/user';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly server: string = 'http://localhost:8080';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  login$ (email: string, password: string) {
    return this.http.post<CustomHttpResponse<ProfileState>>
      (`${this.server}/user/login`, { email, password }) // url same as the UserResource in the backend
      .pipe(
        tap(response => console.log(response)),
        catchError(this.handleError)
      );
  }

  verifyCode$ (email: string, code: string) {
    return this.http.get<CustomHttpResponse<ProfileState>>
      (`${this.server}/user/verify/code/${email}/${code}`)
      .pipe(
        tap(response => console.log(response)),
        catchError(this.handleError)
      );    
  }
    
  profile$ () {
    return this.http.get<CustomHttpResponse<ProfileState>>
      // (`${this.server}/user/profile`, { headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem(Key.TOKEN)}`)})
      (`${this.server}/user/profile`)
      .pipe(
        tap(response => {
          console.log("profile$ response:");
          console.log(response);
        }),
        catchError(this.handleError)
      );
  }

  updateProfile$ (user: User) {
    return this.http.patch<CustomHttpResponse<ProfileState>>
      // (`${this.server}/user/update`, user, { headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem(Key.TOKEN)}`)})
       (`${this.server}/user/update`, user)
      .pipe(
        tap(response => {
          console.log("updateProfile$ response:");
          console.log(response);
        }),
        catchError(this.handleError)
      );
  }

  refreshToken$ () {
    return this.http.get<CustomHttpResponse<ProfileState>>
       (`${this.server}/user/refresh/token`, { headers: { Authorization: `Bearer ${localStorage.getItem(Key.REFRESH_TOKEN)}` }} )
      .pipe(
        tap(response => {
          console.log("refreshToken$ response:");
          console.log(response);

          localStorage.removeItem(Key.TOKEN);
          localStorage.removeItem(Key.REFRESH_TOKEN);
          localStorage.setItem(Key.TOKEN, response.data ? response.data.access_token : '');
          localStorage.setItem(Key.REFRESH_TOKEN, response.data ? response.data.refresh_token : '');
        }),
        catchError(this.handleError)
      );
  }

  isAuthenticated = (): boolean => (
    !this.jwtHelper.isTokenExpired(localStorage.getItem(Key.TOKEN))
  )

  logOut$() {
    localStorage.removeItem(Key.TOKEN);
    localStorage.removeItem(Key.REFRESH_TOKEN);
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);
    let errorMessage: string;
    if (error.status === 0) {
      // Client-side / network failure
      errorMessage = `A client error occurred - ${error.error.message}`;
    } else {
      // Backend responded with error (e.g. 400, 500)
      errorMessage = error.error.reason ?? `An error occurred - Error status ${error.status}`;
    }
    return throwError(() => errorMessage);
  }
}
