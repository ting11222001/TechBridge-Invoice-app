import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login';
import { RegisterComponent } from './component/register/register';
import { ResetpasswordComponent } from './component/resetpassword/resetpassword';
import { Verify } from './component/verify/verify';
import { ProfileComponent } from './component/profile/profile';
import { CustomersComponent } from './component/customers/customers';
import { HomeComponent } from './component/home/home';
import { authenticationGuard } from './authentication-guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'resetpassword', component: ResetpasswordComponent},
    { path: 'user/verify/account/:key', component: Verify},
    { path: 'user/verify/password/:key', component: Verify},
    { path: 'customers', component: CustomersComponent, canActivate: [authenticationGuard]},
    { path: 'profile', component: ProfileComponent, canActivate: [authenticationGuard]},
    { path: '', component: HomeComponent, canActivate: [authenticationGuard]},
    { path: '', redirectTo: '/', pathMatch: 'full'},
    { path: '**', component: HomeComponent}, // If enter some non existing routes, go to the Login page
];