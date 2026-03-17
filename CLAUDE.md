# CLAUDE.md — TechBridge Invoice Frontend

## Project Overview

This is the **Angular 21 frontend** for TechBridge Invoice, an invoice and customer management system for a technology donation platform.

The backend (Spring Boot 4, Java) lives in a separate repository:
- **Backend repo:** https://github.com/ting11222001/TechBridge-Invoice
- **Backend deployed on:** Railway — `https://techbridge-invoice-production.up.railway.app`
- **Frontend deployed on:** Vercel

---

## Tech Stack

- **Angular 21** — standalone component API (no NgModule)
- **Bootstrap 5** — CSS framework
- **RxJS 7** — reactive streams for HTTP and state
- **@auth0/angular-jwt** — JWT decode/expiry checking
- **TypeScript 5**
- **Vitest** — unit testing

---

## Key Directories

```
src/app/
├── component/       # Page and UI components
├── service/         # API call services (user.ts, customer.ts)
├── interface/       # TypeScript interfaces (User, Customer, Invoice, Stats, etc.)
├── interceptor/     # token-interceptor.ts — attaches JWT, handles 401 auto-refresh
├── enum/            # datastate.enum.ts, event-type.enum.ts, key.enum.ts
└── authentication-guard.ts  # Protects /, /profile, /customers routes
```

---

## Environment

| File | `apiUrl` |
|---|---|
| `src/environments/environment.ts` | `http://localhost:8080` |
| `src/environments/environment.prod.ts` | `https://techbridge-invoice-production.up.railway.app` |

The production environment file must be referenced in `angular.json` under `fileReplacements` for the production build to use the Railway URL.

---

## Dev Commands

```bash
npm install        # Install dependencies
ng serve           # Dev server at localhost:4200 (hot reload)
ng build           # Production build → dist/
ng test            # Run unit tests with Vitest
```

---

## Architecture Notes

- **Standalone components** — all components use `standalone: true`; imports are declared per-component, not in a shared NgModule.
- **HTTP Interceptor** (`token-interceptor.ts`) — automatically adds `Authorization: Bearer <token>` to all requests except public endpoints (login, register, verify, resetpassword, refresh). On 401, it calls the refresh endpoint, updates stored tokens, and retries the original request.
- **Auth Guard** (`authentication-guard.ts`) — uses `JwtHelperService.isTokenExpired()` to protect routes. Redirects unauthenticated users to `/login`.
- **Token storage** — access token stored in `localStorage` under key `[KEY] TOKEN`; refresh token under `[REFRESH] REFRESH_TOKEN`.
- **HTTP response pattern** — all backend responses are wrapped in `CustomHttpResponse<T>` with `data`, `message`, `statusCode`, `timestamp` fields.

---

## Routes

| Path | Component | Protected |
|---|---|---|
| `/login` | LoginComponent | No |
| `/register` | RegisterComponent | No |
| `/resetpassword` | ResetpasswordComponent | No |
| `/user/verify/account/:key` | VerifyComponent | No |
| `/user/verify/password/:key` | VerifyComponent | No |
| `/` | HomeComponent | Yes |
| `/customers` | CustomersComponent | Yes |
| `/profile` | ProfileComponent | Yes |
