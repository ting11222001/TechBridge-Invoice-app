import { Component } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { DataState } from '../../enum/datastate.enum';
import { LoginState } from '../../interface/appstates';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../service/user';
import { FormsModule, NgForm } from '@angular/forms';
import { Key } from '../../enum/key.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginState$: Observable<LoginState> = of({ dataState: DataState.LOADED });
  
  private phoneSubject = new BehaviorSubject<string>('');
  private emailSubject = new BehaviorSubject<string>('');

  readonly DataState = DataState;
  
  constructor(private router: Router, private userService: User) {}

  login(loginForm: NgForm): void {
    this.loginState$ = this.userService.login$(loginForm.value.email, loginForm.value.password)
      .pipe(
        map(response => {
          if (!response.data) {
            throw new Error('Response not exists!');
          }
          if (response.data.user?.usingMfa) {
            this.phoneSubject.next(response.data.user.phone ?? '');
            this.emailSubject.next(response.data.user.email);
            return {
              dataState: DataState.LOADED, isUsingMfa: true, loginSuccess: false,
              phone: response.data.user.phone ? 
                response.data.user.phone.substring(response.data.user.phone.length - 4) // only need the last 4 digits
                : ''
            };
          } else {
            localStorage.setItem(Key.TOKEN, response.data.access_token);
            localStorage.setItem(Key.REFRESH_TOKEN, response.data.refresh_token);
            this.router.navigate(['/']); // to the home page
            return { dataState: DataState.LOADED, loginSuccess: true };
          }
        }),
        startWith({ dataState: DataState.LOADING, isUsingMfa: false }),
        catchError((error: string) => 
            of({ dataState: DataState.ERROR, isUsingMfa: false, loginSuccess: false, error })
        )
      )
  }

  verifyCode(verifyCodeForm: NgForm): void {
    this.loginState$ = this.userService.verifyCode$(this.emailSubject.value, verifyCodeForm.value.code)
      .pipe(
        map(response => {
            if (!response.data) {
              throw new Error('Response not exists!');
            }
            localStorage.setItem(Key.TOKEN, response.data.access_token);
            localStorage.setItem(Key.REFRESH_TOKEN, response.data.refresh_token);
            this.router.navigate(['/']); // to the home page
            return { dataState: DataState.LOADED, loginSuccess: true };
          
        }),
        startWith({ dataState: DataState.LOADING, isUsingMfa: false }),
        catchError((error: string) => 
            of({ dataState: DataState.ERROR, isUsingMfa: false, loginSuccess: false, error })
        )
      )
  }

  loginPage(): void {
    this.loginState$ = of({ dataState: DataState.LOADED });
  }
}
