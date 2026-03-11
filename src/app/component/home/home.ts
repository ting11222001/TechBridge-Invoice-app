import { Component } from '@angular/core';
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

  constructor(private userService: UserService, private customerService: CustomerService) { }

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

  selectedCustomer(customer: Customer): void {}
}
