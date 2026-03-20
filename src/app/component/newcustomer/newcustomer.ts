import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { State } from '../../interface/state';
import { CustomersPageResponse, CustomHttpResponse } from '../../interface/appstates';
import { CustomerService } from '../../service/customer';
import { DataState } from '../../enum/datastate.enum';

@Component({
  selector: 'app-newcustomer',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './newcustomer.html',
  styleUrl: './newcustomer.css',
})
export class NewCustomerComponent {
  newCustomerState$!: Observable<State<CustomHttpResponse<CustomersPageResponse>>>;
  private data = signal<CustomHttpResponse<CustomersPageResponse> | undefined>(undefined);
  readonly DataState = DataState;

  isLoading = signal<boolean>(true);

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.newCustomerState$ = this.customerService.customers$()
      .pipe(
        map(response => {
          this.data.set(response);
          this.isLoading.set(false);
          return { 
            dataState: DataState.LOADED, 
            appData: response 
          };
        }),
        startWith({ 
          dataState: DataState.LOADING 
        }),
        catchError((error: string) => {
          return of({ 
            dataState: DataState.ERROR, 
            appData: this.data(),
            error 
          })
        })
      )
  }

  createCustomer(newCustomerForm: NgForm): void {
    this.isLoading.set(true);
    this.newCustomerState$ = this.customerService.newCustomer$(newCustomerForm.value)
    .pipe(
      map(response => {
        newCustomerForm.reset({ type: 'INDIVIDUAL', status: 'ACTIVE' });
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
      }
    ));
  }
}
