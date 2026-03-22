# Architecture

Deep-dive system design notes for TechBridge Invoice.

---

## Overview

Clean client-server split. Docker is used locally for the database only. The frontend deploys directly to Vercel and the backend directly to Railway.

---

## Frontend (Angular 21)

### Component Hierarchy

All authenticated routes are nested under `ShellComponent`, which renders `NavbarComponent` + `<router-outlet>`. Public routes (login, register, etc.) sit outside the shell.

```
ShellComponent (authenticated layout)
  ├── NavbarComponent
  └── router-outlet
        ├── HomeComponent
        ├── ProfileComponent
        ├── CustomersComponent
        ├── CustomerComponent
        ├── NewCustomerComponent
        ├── InvoicesComponent
        ├── InvoiceComponent
        └── NewInvoiceComponent
```

### Data Flow

```
Browser
  └── Angular Components
      └── Services (CustomerService, UserService)
          └── HTTP Interceptors (attach JWT, handle 401 refresh)
              └── HTTP Request to Backend
```

### Key Patterns

**Standalone Components**
All components use `standalone: true`. Imports are declared per-component with no shared NgModule, keeping dependencies explicit and tree-shakeable.

**Functional Interceptor**
`token-interceptor.ts` uses `HttpInterceptorFn` with `inject()` — the modern Angular pattern that avoids class-based boilerplate.

**State Shape**
Every component page state follows the same shape using `DataState` enum:
```typescript
{ dataState: DataState.LOADING | LOADED | ERROR, appData?: T, error?: string }
```

**HTTP Response Wrapper**
All backend responses are typed as `CustomHttpResponse<T>`:
```typescript
{ data: T, message: string, statusCode: number, timestamp: string }
```

**Signals for Local State**
`currentPage = signal<number>(0)` — reactive local state without RxJS for simple values.

**RxJS Pipeline Pattern**
```typescript
this.service.getCustomers(page).pipe(
  map(response => ({ dataState: LOADED, appData: response })),
  startWith({ dataState: LOADED, appData: this.data() }),  // show stale data while loading
  catchError(error => of({ dataState: ERROR, error }))
)
```

---

## Backend (Spring Boot 4)

### Request Lifecycle

```
HTTP Request
  └── Spring Security Filter Chain
      ├── CustomAuthorizationFilter (JWT validation)
      └── UsernamePasswordAuthenticationFilter (login only)
          └── ProviderManager
              └── DaoAuthenticationProvider
                  └── UserDetailsService (loads user from DB)
  └── REST Controllers (@RestController)
      └── Service Layer
          └── Repositories (JPA + JDBC)
              └── MySQL DB
```

### Auth Flow Detail

Login:
1. `UsernamePasswordAuthenticationFilter` receives credentials
2. `ProviderManager` → `DaoAuthenticationProvider` → `UserDetailsService` loads user
3. On success: issues Access Token (short-lived) + Refresh Token (longer-lived), both JWT

Per-request:
1. `CustomAuthorizationFilter` validates JWT on every protected request
2. Extracts claims, checks permissions, rejects unauthorised requests early

### Token Storage (Frontend)

| Token | localStorage key |
|---|---|
| Access Token | `[KEY] TOKEN` |
| Refresh Token | `[REFRESH] REFRESH_TOKEN` |

---

## Infrastructure

```
Local Development
  └── Docker
      └── MySQL Container (port 3306)

Production
  ├── Vercel — Angular frontend (auto-deploy from main)
  └── Railway
      ├── Spring Boot backend
      └── MySQL managed database
```

### Environment URLs

| Environment | API URL |
|---|---|
| Dev | `http://localhost:8080` |
| Prod | `https://techbridge-invoice-production.up.railway.app` |

Configured via `src/environments/environment.ts` and `environment.prod.ts`. The prod file is swapped in at build time via `fileReplacements` in `angular.json`.

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
| `/profile` | ProfileComponent | Yes |
| `/customers` | CustomersComponent | Yes |
| `/customers/new` | NewCustomerComponent | Yes |
| `/customers/:id` | CustomerComponent | Yes |
| `/invoices` | InvoicesComponent | Yes |
| `/invoices/new` | NewInvoiceComponent | Yes |
| `/invoices/:id/:invoiceNumber` | InvoiceComponent | Yes |

Protected routes are children of `ShellComponent` in `app.routes.ts`. The auth guard is applied once at the shell level.
