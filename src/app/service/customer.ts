import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CustomHttpResponse, CustomersPageResponse, NewCustomerResponse } from '../interface/appstates';
import { catchError, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Customer } from '../interface/customer';
import { User } from '../interface/user';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly server: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  customers$ (page: number = 0) {
    return this.http.get<CustomHttpResponse<CustomersPageResponse>>
      (`${this.server}/customer/list?page=${page}`)
      .pipe(
        tap(response => console.log("CustomerService get customers response: ", response)),
        catchError(this.handleError)
      );
  }

  newcustomer$ (customer: Customer) {
    return this.http.post<CustomHttpResponse<CustomersPageResponse>>
      (`${this.server}/customer/create`, customer)
      .pipe(
        tap(response => console.log("CustomerService get new customer response: ", response)),
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
