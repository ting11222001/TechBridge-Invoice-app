import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Key } from '../enum/key.enum';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { UserService } from '../service/user';

/**
 * @param request = the outgoing HTTP request
 * @param next = the function that passes the request to the next step in Angular's HTTP pipeline
 * @returns Observable<HttpEvent<unknown>> This means the interceptor cannot just return random data. It must return an HTTP event stream.
 */
export function tokenInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const userService = inject(UserService);

  if (request.url.includes('verify') || 
    request.url.includes('login') || 
    request.url.includes('register') || 
    request.url.includes('refresh') ||
    request.url.includes('resetpassword')
  ) {
      // Do not need to intercept here as they don't need access tokens
      return next(request);
  }

  return next(addAuthorizationTokenHeader(request))
  .pipe(
    catchError((error: HttpErrorResponse) => {
      // Token expired and needs to be refreshed
      if (error instanceof HttpErrorResponse && error.status === 401 && error.error.status.includes('UNAUTHORIZED')) {
        return userService.refreshToken$()
          .pipe(
            switchMap((response) => {
              // console.log('New Token:', response.data?.access_token);
              // console.log('Sending original request:', request);
              
              // When refresh succeeds, send the original request again with the new token
              return next(addAuthorizationTokenHeader(request));
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