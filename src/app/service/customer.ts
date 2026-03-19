import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CustomHttpResponse, CustomersPageResponse, GetCustomerResponse, GetInvoiceResponse, InvoicesPageResponse, NewInvoiceResponse } from '../interface/appstates';
import { catchError, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Customer } from '../interface/customer';
import { Invoice } from '../interface/invoice';

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

  customer$ (customerId: number) {
    return this.http.get<CustomHttpResponse<GetCustomerResponse>>
      (`${this.server}/customer/get/${customerId}`)
      .pipe(
        tap(response => console.log("CustomerService get customer response: ", response)),
        catchError(this.handleError)
      );
  }

  newCustomer$ (customer: Customer) {
    return this.http.post<CustomHttpResponse<CustomersPageResponse>>
      (`${this.server}/customer/create`, customer)
      .pipe(
        tap(response => console.log("CustomerService get new customer response: ", response)),
        catchError(this.handleError)
      );
  }

  updateCustomer$ (customer: Customer) {
    return this.http.put<CustomHttpResponse<GetCustomerResponse>>
      (`${this.server}/customer/update`, customer)
      .pipe(
        tap(response => console.log("CustomerService update customer response: ", response)),
        catchError(this.handleError)
      );
  }

  searchCustomers$ (name: string = '', page: number = 0) {
    return this.http.get<CustomHttpResponse<CustomersPageResponse>>
      (`${this.server}/customer/search?name=${name}&page=${page}`)
      .pipe(
        tap(response => console.log("CustomerService search customer response: ", response)),
        catchError(this.handleError)
      );
  }

  newInvoice$ () {
    return this.http.get<CustomHttpResponse<NewInvoiceResponse>>
      (`${this.server}/customer/invoice/new`)
      .pipe(
        tap(response => console.log("CustomerService new invoice response: ", response)),
        catchError(this.handleError)
      );
  }

  createInvoice$ (customerId: number, invoice: Invoice) {   // create invoice for a specific customer
    return this.http.put<CustomHttpResponse<NewInvoiceResponse>>
      (`${this.server}/customer/invoice/addToCustomer/${customerId}`, invoice)
      .pipe(
        tap(response => console.log("CustomerService create invoice response: ", response)),
        catchError(this.handleError)
      );
  }

  invoices$ (page: number = 0) {   // get invoices
    return this.http.get<CustomHttpResponse<InvoicesPageResponse>>
      (`${this.server}/customer/invoice/list?page=${page}`)
      .pipe(
        tap(response => console.log("CustomerService get invoices response: ", response)),
        catchError(this.handleError)
      );
  }

  invoice$ (invoiceId: number) {
    return this.http.get<CustomHttpResponse<GetInvoiceResponse>>
      (`${this.server}/customer/invoice/get/${invoiceId}`)
      .pipe(
        tap(response => console.log("CustomerService get invoice response: ", response)),
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
