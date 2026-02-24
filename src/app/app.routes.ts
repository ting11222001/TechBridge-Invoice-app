import { Routes } from '@angular/router';
import { Login } from './component/login/login';
import { Register } from './component/register/register';
import { Resetpassword } from './component/resetpassword/resetpassword';
import { Verify } from './component/verify/verify';

export const routes: Routes = [
    { path: 'login', component: Login},
    { path: 'register', component: Register},
    { path: 'resetpassword', component: Resetpassword},
    { path: 'user/verify/account/:key', component: Verify},
    { path: 'user/verify/password/:key', component: Verify},
    { path: '**', component: Login}, // If enter some non existing routes, go to the Login page
];