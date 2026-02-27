import { Routes } from '@angular/router';
import { Login } from './component/login/login';
import { Register } from './component/register/register';
import { Resetpassword } from './component/resetpassword/resetpassword';
import { Verify } from './component/verify/verify';
import { Profile } from './component/profile/profile';
import { Customers } from './component/customers/customers';
import { Home } from './component/home/home';

export const routes: Routes = [
    { path: 'login', component: Login},
    { path: 'register', component: Register},
    { path: 'resetpassword', component: Resetpassword},
    { path: 'user/verify/account/:key', component: Verify},
    { path: 'user/verify/password/:key', component: Verify},
    { path: 'customers', component: Customers},
    { path: 'profile', component: Profile},
    { path: '', component: Home},
    { path: '', redirectTo: '/', pathMatch: 'full'},
    { path: '**', component: Home}, // If enter some non existing routes, go to the Login page
];