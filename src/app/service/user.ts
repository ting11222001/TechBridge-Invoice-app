import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { CustomHttpResponse, Profile } from '../interface/appstates';
import { Key } from '../enum/key.enum';
import { User } from '../interface/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly server: string = environment.apiUrl;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  login$ (email: string, password: string) {
    return this.http.post<CustomHttpResponse<Profile>>
      (`${this.server}/user/login`, { email, password }) // url same as the UserResource in the backend
      .pipe(
        tap(response => console.log("UserService login response: ", response)),
        catchError(this.handleError)
      );
  }

  verifyCode$ (email: string, code: string) {
    return this.http.get<CustomHttpResponse<Profile>>
      (`${this.server}/user/verify/code/${email}/${code}`)
      .pipe(
        tap(response => console.log("UserService verifyCode response: ", response)),
        catchError(this.handleError)
      );    
  }
    
  profile$ () {
    return this.http.get<CustomHttpResponse<Profile>>
      // (`${this.server}/user/profile`, { headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem(Key.TOKEN)}`)})
      (`${this.server}/user/profile`)
      .pipe(
        tap(response => console.log("UserService profile response: ", response)),
        catchError(this.handleError)
      );
  }

  updateProfile$ (user: User) {
    return this.http.patch<CustomHttpResponse<Profile>>
      // (`${this.server}/user/update`, user, { headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem(Key.TOKEN)}`)})
       (`${this.server}/user/update`, user)
      .pipe(
        tap(response => console.log("UserService updateProfile response: ", response)),
        catchError(this.handleError)
      );
  }

  refreshToken$ () {
    return this.http.get<CustomHttpResponse<Profile>>
       (`${this.server}/user/refresh/token`, { headers: { Authorization: `Bearer ${localStorage.getItem(Key.REFRESH_TOKEN)}` }} )
      .pipe(
        tap(response => {
          console.log("UserService refreshToken response: ", response)

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
