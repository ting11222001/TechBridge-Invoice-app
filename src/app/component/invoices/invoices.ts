import { Component, OnInit, signal } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { State } from '../../interface/state';
import {
  CustomHttpResponse,
  InvoicesPageResponse,
} from '../../interface/appstates';
import { CustomerService } from '../../service/customer';
import { DataState } from '../../enum/datastate.enum';

@Component({
  selector: 'app-invoices',
  imports: [FormsModule, CommonModule, RouterModule, NavbarComponent],
  templateUrl: './invoices.html',
  styleUrl: './invoices.css',
})
export class InvoicesComponent implements OnInit {
  invoicesState$!: Observable<State<CustomHttpResponse<InvoicesPageResponse>>>;
  private data = signal<CustomHttpResponse<InvoicesPageResponse> | undefined>(undefined);
  readonly DataState = DataState;
  isLoading = signal<boolean>(true);
  currentPage = signal<number>(0);

  constructor(
    private router: Router,
    private customerService: CustomerService,
  ) {}

  ngOnInit(): void {
    this.invoicesState$ = this.customerService.invoices$()
      .pipe(
        map((response) => {
          this.data.set(response);
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
  }

  goToPage(pageNumber: number): void {
    this.invoicesState$ = this.customerService.invoices$(pageNumber).pipe(
      map((response) => {
        this.data.set(response);
        this.currentPage.set(pageNumber);
        return {
          dataState: DataState.LOADED,
          appData: response,
        };
      }),
      startWith({
        dataState: DataState.LOADED,
        appData: this.data(),
      }),
      catchError((error: string) => {
        return of({
          dataState: DataState.LOADED,
          appData: this.data(),
          error,
        });
      }),
    );
  }

  goToNextOrPreviousPage(direction?: string): void {
    this.goToPage(direction === 'forward' ? this.currentPage() + 1 : this.currentPage() - 1);
  }
}
