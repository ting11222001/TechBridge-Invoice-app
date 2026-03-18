import { Component, signal } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { State } from '../../interface/state';
import { CustomersPageResponse, CustomHttpResponse } from '../../interface/appstates';
import { CustomerService } from '../../service/customer';
import { DataState } from '../../enum/datastate.enum';
import { Customer } from '../../interface/customer';

@Component({
  selector: 'app-customers',
  imports: [FormsModule, CommonModule, RouterModule, NavbarComponent],
  templateUrl: './customers.html',
  styleUrl: './customers.css',
})
export class CustomersComponent {
  customersState$!: Observable<State<CustomHttpResponse<CustomersPageResponse>>>;
  private data = signal<CustomHttpResponse<CustomersPageResponse> | undefined>(undefined);
  readonly DataState = DataState;
  isLoading = signal<boolean>(true);
  currentPage = signal<number>(0);

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.customersState$ = this.customerService.searchCustomers$()
      .pipe(
        map(response => {
          this.data.set(response);
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

  searchCustomers(searchForm: NgForm): void {
    this.isLoading.set(true);
    this.customersState$ = this.customerService.searchCustomers$(searchForm.value.name)
    .pipe(
      map(response => {
        // searchForm.reset({ keyword: '' });
        this.data.set(response);
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

   goToPage(pageNumber: number, name?: string): void {
    this.customersState$ = this.customerService.searchCustomers$(name, pageNumber)
      .pipe(
        map(response => {
          this.data.set(response);
          this.currentPage.set(pageNumber);
          return { 
            dataState: DataState.LOADED, 
            appData: response
          };
        }),
        startWith({ 
          dataState: DataState.LOADED,
          appData: this.data()
        }),
        catchError((error: string) => {
          return of({ 
            dataState: DataState.LOADED,
            appData: this.data(),
            error 
          })
        })
      )
  }

  goToNextOrPreviousPage(direction?: string, name?: string): void {
    this.goToPage(direction === 'forward' ? this.currentPage() + 1 : this.currentPage() - 1, name);
  }

  selectedCustomer(customer: Customer): void {}
}
