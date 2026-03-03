import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Key } from '../enum/key.enum';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { UserService } from '../service/user';

export function tokenInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  // console.log('[Outgoing Request]');

  const userService = inject(UserService);

  if (request.url.includes('verify') || 
    request.url.includes('login') || 
    request.url.includes('register') || 
    request.url.includes('refresh') ||
    request.url.includes('resetpassword')
  ) {
      // console.log('Does not need to intercept');
      return next(request);
  }

  return next(addAuthorizationTokenHeader(request))
  .pipe(
    catchError((error: HttpErrorResponse) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && error.error.status.includes('UNAUTHORIZED')) {
        // console.log('Token expired and needs to be refreshed');
        
        return userService.refreshToken$()
          .pipe(
            switchMap((response) => {
              // console.log('New Token:', response.data?.access_token);
              // console.log('Sending original request:', request);

              return next(addAuthorizationTokenHeader(request))
            })
          );
      }
      
      console.log('Refresh failed');
      return throwError(() => error);
    })
  );
}

const addAuthorizationTokenHeader = (request: HttpRequest<unknown>) => {
  // console.log('Intercept with authorization header');
  const req = request.clone({
    headers: request.headers.set('Authorization', `Bearer ${localStorage.getItem(Key.TOKEN)}`)
  });
  // console.log(req);
  return req;
};