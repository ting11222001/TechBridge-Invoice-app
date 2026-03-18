import { Component, OnInit, signal } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { State } from '../../interface/state';
import { CustomHttpResponse, NewInvoiceResponse } from '../../interface/appstates';
import { CustomerService } from '../../service/customer';
import { DataState } from '../../enum/datastate.enum';  

@Component({
  selector: 'app-newinvoice',
  imports: [FormsModule, CommonModule, RouterModule, NavbarComponent],
  templateUrl: './newinvoice.html',
  styleUrl: './newinvoice.css',
})
export class NewInvoiceComponent implements OnInit {
  newInvoiceState$!: Observable<State<CustomHttpResponse<NewInvoiceResponse>>>;
  private data = signal<CustomHttpResponse<NewInvoiceResponse> | undefined>(undefined);
  readonly DataState = DataState;

  isLoading = signal<boolean>(true);

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.newInvoiceState$ = this.customerService.newInvoice$()
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

  newInvoice(invoiceForm: NgForm): void {   // create invoice for a specific customer
    // this.data.set({ ...this.data()?.value, message: null}); // why???
    this.isLoading.set(true);
    this.newInvoiceState$ = this.customerService.createInvoice$(invoiceForm.value.customerId, invoiceForm.value)
    .pipe(
      map(response => {
        invoiceForm.reset({ status: 'PENDING' });
        this.data.set(response);  // to show invoice created message in the alert on UI
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
