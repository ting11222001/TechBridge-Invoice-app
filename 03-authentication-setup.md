Use this to attach a JSON Web Token to HttpClient requests:
https://www.npmjs.com/package/@auth0/angular-jwt

Installed by:
```
npm i @auth0/angular-jwt
```

`JwtHelperService` > `_isTokenExpired`:

Here has defined that if token not present, then it's considered as expired:
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