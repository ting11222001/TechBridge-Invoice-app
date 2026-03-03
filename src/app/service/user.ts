import { HttpClient, HttpErrorResponse, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { CustomHttpResponse, ProfileState } from '../interface/appstates';
import { Key } from '../enum/key.enum';
import { User } from '../interface/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly server: string = 'http://localhost:8080';
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
      (`${this.server}/user/profile`, { headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem(Key.TOKEN)}`)})
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
      (`${this.server}/user/update`, user, { headers: new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem(Key.TOKEN)}`)})
      .pipe(
        tap(response => {
          console.log("updateProfile$ response:");
          console.log(response);
        }),
        catchError(this.handleError)
      );
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
