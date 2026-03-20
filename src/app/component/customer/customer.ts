import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router, RouterModule } from '@angular/router';
import { catchError, map, Observable, of, startWith, switchMap } from 'rxjs';
import { State } from '../../interface/state';
import { CustomHttpResponse, GetCustomerResponse } from '../../interface/appstates';
import { CustomerService } from '../../service/customer';
import { DataState } from '../../enum/datastate.enum';


@Component({
  selector: 'app-customer',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './customer.html',
  styleUrl: './customer.css',
})
export class CustomerComponent implements OnInit {
  customerState$!: Observable<State<CustomHttpResponse<GetCustomerResponse>>>;
  private data = signal<CustomHttpResponse<GetCustomerResponse> | undefined>(undefined);
  readonly DataState = DataState;
  isLoading = signal<boolean>(true);
  readonly CUSTOMER_ID: string = 'id';

  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.customerState$ = this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {     // switchMap: we're switching from the paramMap observable to the customer$ observable that makes the API call
        return this.customerService.customer$(Number(params.get(this.CUSTOMER_ID))).pipe(
          map((response) => {
            this.data.set(response);
            this.isLoading.set(false);
            return {
              dataState: DataState.LOADED,
              appData: response,
            };
          }),
          startWith({
            dataState: DataState.LOADING,
          }),
          catchError((error: string) => {
            return of({
              dataState: DataState.ERROR,
              appData: this.data(),
              error,
            });
          }),
        );
      }),
    );
  }

  updateCustomer(customerForm: NgForm): void {
    this.isLoading.set(true);
    this.customerState$ = this.customerService.updateCustomer$(customerForm.value)
    .pipe(
      map(response => {
        this.data.set({
          ...response,          // copy everything from response
          data: {               // but OVERRIDE data with:
            ...response.data,   // copy everything from response.data
            customer: {         // but OVERRIDE customer with:
              ...response.data.customer,    // copy everything from the customer
              invoices: this.data()?.data.customer.invoices || []   // if data() returns undefined, the ?. short-circuits and returns undefined, giving [].
            }
          }
        });
        this.isLoading.set(false);
        return {
          dataState: DataState.LOADED,
          appData: this.data()
        };
      }),
      startWith({
        dataState: DataState.LOADED,
        appData: this.data()
      }),
      catchError((error: string) => {
        this.isLoading.set(false);
        return of({
          dataState: DataState.LOADED,
          appData: this.data(),
          error
        });
      })
    )
  }
}
