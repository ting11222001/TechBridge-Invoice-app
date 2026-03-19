import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login';
import { RegisterComponent } from './component/register/register';
import { ResetpasswordComponent } from './component/resetpassword/resetpassword';
import { Verify } from './component/verify/verify';
import { ProfileComponent } from './component/profile/profile';
import { CustomersComponent } from './component/customers/customers';
import { HomeComponent } from './component/home/home';
import { authenticationGuard } from './authentication-guard';
import { NewCustomerComponent } from './component/newcustomer/newcustomer';
import { NewInvoiceComponent } from './component/newinvoice/newinvoice';
import { InvoicesComponent } from './component/invoices/invoices';
import { InvoiceComponent } from './component/invoice/invoice';
import { CustomerComponent } from './component/customer/customer';
import { ShellComponent } from './shell/shell';

export const routes: Routes = [
    { path: '', component: ShellComponent, children: [
        { path: '', component: HomeComponent, canActivate: [authenticationGuard] }
    ]},
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'resetpassword', component: ResetpasswordComponent},
    { path: 'user/verify/account/:key', component: Verify},
    { path: 'user/verify/password/:key', component: Verify},
    { path: 'customers', component: CustomersComponent, canActivate: [authenticationGuard]},
    { path: 'profile', component: ProfileComponent, canActivate: [authenticationGuard]},
    { path: 'customers/new', component: NewCustomerComponent, canActivate: [authenticationGuard] },
    { path: 'invoices/new', component: NewInvoiceComponent, canActivate: [authenticationGuard] },
    { path: 'invoices', component: InvoicesComponent, canActivate: [authenticationGuard] },
    { path: 'customers/:id', component: CustomerComponent, canActivate: [authenticationGuard] },
    { path: 'invoices/:id/:invoiceNumber', component: InvoiceComponent, canActivate: [authenticationGuard] },
    // { path: '', component: HomeComponent, canActivate: [authenticationGuard]},
    { path: '', redirectTo: '/', pathMatch: 'full'},
    { path: '**', component: HomeComponent}, // If enter some non existing routes, go to the Login page
];