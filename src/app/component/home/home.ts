import { Component, signal } from '@angular/core';
import { Stats } from '../stats/stats';
import { Navbar } from '../navbar/navbar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { State } from '../../interface/state';
import { CustomersPageResponse, CustomHttpResponse } from '../../interface/appstates';
import { CustomerService } from '../../service/customer';
import { UserService } from '../../service/user';
import { DataState } from '../../enum/datastate.enum';
import { Customer } from '../../interface/customer';

@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule,Stats, RouterModule, Navbar],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  homeState$!: Observable<State<CustomHttpResponse<CustomersPageResponse>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<CustomersPageResponse> | undefined>(undefined);
  readonly DataState = DataState;

  currentPage = signal<number>(0);

  constructor(private customerService: CustomerService) { }

  ngOnInit(): void {
    this.homeState$ = this.customerService.customers$()
      .pipe(
        map(response => {
          this.dataSubject.next(response);
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
            appData: this.dataSubject.value,
            error 
          })
        })
      )
  }

  goToPage(pageNumber: number): void {
    this.homeState$ = this.customerService.customers$(pageNumber)
      .pipe(
        map(response => {
          this.dataSubject.next(response);
          this.currentPage.set(pageNumber);
          return { 
            dataState: DataState.LOADED, 
            appData: response // Then when API returns, emit the new data
          };
        }),
        startWith({ 
          dataState: DataState.LOADED, // Before the HTTP request finishes, emit the previous data
          appData: this.dataSubject.value
        }),
        catchError((error: string) => {
          return of({ 
            dataState: DataState.LOADED,  // keep the same data
            appData: this.dataSubject.value,
            error 
          })
        })
      )
  }

  goToNextOrPreviousPage(direction?: string): void {
    // in the template, it needs to disable the prev button when the current page value is less than zero
    this.goToPage(direction === 'forward' ? this.currentPage() + 1 : this.currentPage() - 1);
  }

  selectedCustomer(customer: Customer): void {}
}
