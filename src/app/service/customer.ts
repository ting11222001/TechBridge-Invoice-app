import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { CustomHttpResponse } from '../interface/appstates';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly server: string = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  customers$ (page: number = 0, size: number = 0) {
    return this.http.get<CustomHttpResponse<any>>
      (`${this.server}/customer/list?page=${page}?size=${size}`)
      .pipe(
        tap(response => console.log(response)),
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
