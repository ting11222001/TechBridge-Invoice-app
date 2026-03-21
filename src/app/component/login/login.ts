import { Component, OnInit, signal } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { DataState } from '../../enum/datastate.enum';
import { Login } from '../../interface/appstates';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../service/user';
import { FormsModule, NgForm } from '@angular/forms';
import { Key } from '../../enum/key.enum';
import { CommonModule } from '@angular/common';
import { DEMO_ACCOUNT_EMAIL, DEMO_ACCOUNT_PASSWORD } from '../../../constants/demo.constants';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit {
  loginState$: Observable<Login> = of({ dataState: DataState.LOADED });
  
  phone = signal<string>('');
  email = signal<string>('');

  readonly DataState = DataState;
  
  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.userService.isAuthenticated() ? this.router.navigate(['/']) : this.router.navigate(['/login']);
  }

  login(loginForm: NgForm): void {
    const { email, password } = loginForm.value;
    // console.log(loginForm);

    this.loginState$ = this.userService.login$(email, password)
      .pipe(
        map(response => {
          if (!response.data) {
            throw new Error('Response not exists!');
          }
          if (response.data.user?.usingMfa) {
            this.phone.set(response.data.user.phone ?? '');
            this.email.set(response.data.user.email);
            return {
              dataState: DataState.LOADED, 
              isUsingMfa: true, 
              loginSuccess: false,
              phone: response.data.user.phone ? 
                response.data.user.phone.substring(response.data.user.phone.length - 4) // only need the last 4 digits; currently using the signal state in html
                : ''
            };
          } else {
            localStorage.setItem(Key.TOKEN, response.data.access_token);
            localStorage.setItem(Key.REFRESH_TOKEN, response.data.refresh_token);
            this.router.navigate(['/']); // to the home page
            return { 
              dataState: DataState.LOADED,
              loginSuccess: true 
            };
          }
        }),
        startWith({ 
          dataState: DataState.LOADING, 
          isUsingMfa: false 
        }),
        catchError((error: string) => {
            return of({ 
              dataState: DataState.ERROR, 
              isUsingMfa: false, 
              loginSuccess: false, 
              error // thrown error message from the login$
            });
          }
        )
      )
  }

  verifyCode(verifyCodeForm: NgForm): void {
    this.loginState$ = this.userService.verifyCode$(this.email(), verifyCodeForm.value.code)
      .pipe(
        map(response => {
            if (!response.data) {
              throw new Error('Response not exists!');
            }
            localStorage.setItem(Key.TOKEN, response.data.access_token);
            localStorage.setItem(Key.REFRESH_TOKEN, response.data.refresh_token);
            this.router.navigate(['/']); // to the home page
            return { 
              dataState: DataState.LOADED, 
              loginSuccess: true };
          
        }),
        startWith({ 
          dataState: DataState.LOADING, 
          isUsingMfa: false }),
        catchError((error: string) => 
            of({ 
              dataState: DataState.ERROR, 
              isUsingMfa: false, 
              loginSuccess: false, 
              error 
            })
        )
      )
  }

  loginPage(): void {
    this.loginState$ = of({ dataState: DataState.LOADED });
  }

  fillDemoCredentials(logingForm: NgForm): void {
    logingForm.form.patchValue({
      email: DEMO_ACCOUNT_EMAIL,
      password: DEMO_ACCOUNT_PASSWORD
    });
    logingForm.form.markAsDirty();
  }
}
