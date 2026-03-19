import { Component, OnInit, signal } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, RouterModule } from '@angular/router';
import { catchError, map, Observable, of, startWith, switchMap } from 'rxjs';
import { State } from '../../interface/state';
import { CustomHttpResponse, GetInvoiceResponse } from '../../interface/appstates';
import { CustomerService } from '../../service/customer';
import { DataState } from '../../enum/datastate.enum';
import { jsPDF } from "jspdf";

@Component({
  selector: 'app-invoice',
  imports: [FormsModule, CommonModule, RouterModule, NavbarComponent],
  templateUrl: './invoice.html',
  styleUrl: './invoice.css',
})
export class InvoiceComponent implements OnInit {
  invoiceState$!: Observable<State<CustomHttpResponse<GetInvoiceResponse>>>;
  private data = signal<CustomHttpResponse<GetInvoiceResponse> | undefined>(undefined);
  readonly DataState = DataState;
  isLoading = signal<boolean>(true);
  readonly INVOICE_ID: string = 'id';

  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.invoiceState$ = this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.customerService.invoice$(Number(params.get('id'))).pipe(
          map((response) => {
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
            this.isLoading.set(false);
            return of({
              dataState: DataState.ERROR,
              appData: undefined,
              error
            });
          }),
        );
      }),
    );
  }

  exportAsPDF(): void {
    const inv = this.data()?.data?.invoice;
    const fileName = `techBridge-invoice-${inv?.invoiceNumber ?? 'unknown'}.pdf`;
    const element = document.getElementById('invoice')!;

    const pdf = new jsPDF();

    pdf.html(element, {
      margin: 5,
      width: 200,
      windowWidth: element.scrollWidth, // Use the full width of the element for better resolution
      autoPaging: false,
      callback: (doc) => doc.save(fileName),
    });
  }
}