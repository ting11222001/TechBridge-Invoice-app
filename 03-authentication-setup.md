# Where refresh tokens actually happen:

Refresh usually happens in the Angular interceptor, not in the component.

```
User makes request
       |
       v
Interceptor attaches access token
       |
       v
Backend verifies token
       |
   if expired → 401
       |
       v
Interceptor catches 401
       |
       v
Call /refresh/token with refresh token
       |
       v
Get new access token
       |
       v
Retry original request
```

Angular interceptor
```
catchError(401)
    → call refresh token endpoint
    → update access token
    → retry request
```

# JwtHelperService

Mostly for small UI conveniences, such as:

```
isAuthenticated(): boolean {
  const token = localStorage.getItem(Key.TOKEN);
  return !!token && !this.jwtHelper.isTokenExpired(token);
}
```

Used for:
- hiding login page e.g. if logged in, the local storage has the valid access token, then user cannot direct themselves to the log in page, `/login`, but to the home page, `/`.
- navbar
- route guards

Not for security.

Installed by:
https://www.npmjs.com/package/@auth0/angular-jwt
```
npm i @auth0/angular-jwt
```

`JwtHelperService` > `_isTokenExpired`:

Here it has defined that if token not present in the local storage, then it's considered as expired:
https://github.com/auth0/angular2-jwt/blob/main/projects/angular-jwt/src/lib/jwthelper.service.ts
```
  private _isTokenExpired(
    token: string | null,
    offsetSeconds?: number
  ): boolean {
    if (!token || token === '') {
      return true;
    }
    ...
  }
```

The architecture should be:
- Use JwtHelperService only for route guards / UI
- Handle refresh entirely in interceptor
- Backend controls real security


# Control route access with Angular Guards

https://angular.dev/guide/routing/route-guards#canactivate
