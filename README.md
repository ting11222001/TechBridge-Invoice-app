# TechBridge-Invoice (Frontend)

TechBridge-Invoice is a full-stack, invoicing and financial records module for the TechBridge device donation platform. It lets admins create and manage customers, issue invoices, export reports, and control access with secure JWT-based authentication.

Explores the invoicing/financial records module for the TechBridge device donation platform. Built with Spring Boot + Angular as a focused learning project before integrating into the full system.

In the TechBridge platform, admins coordinate with organisations (donors, refurb partners, schools). There's a natural need to:

- Issue invoices to refurb partners for their services
- Track donations as financial records for compliance and tax purposes
- Generate receipts for business donors (they need these for tax deductions)

**[Backend Repo](#getting-started-backend)** - **[Full Demo Video (YouTube)](#)**

## Demo

**[Watch the full demo video on YouTube](#)**

<!-- TODO: add vercel link and explanation railway for the backend may pause after some time -->

<!-- TODO: add demo GIF from /demo folder once recorded -->


## Table of Contents
- [Tech Stack](#tech-stack)
- [Business Requirements](#business-requirements)
- [Features](#features)
- [User Scenarios](#user-scenarios)
- [Architecture](#architecture)
- [Login Flow](#login-flow)
- [Engineering Highlights](#engineering-highlights)
- [Getting Started (Frontend)](#getting-started-frontend)
- [Getting Started (Backend)](#getting-started-backend)
- [Deployment](#deployment)
- [What's Next](#whats-next)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 21, Tailwind CSS 4 |
| Backend | Spring Boot 4.0.2 (Java 17), Spring Security, Lombok |
| Auth | JWT (auth0 java-jwt), Twilio MFA/SMS |
| Database | MySQL 8.0 |
| Frontend Deploy | Vercel |
| Backend + DB Deploy | Railway |

## Business Requirements

The features below are created from a mock business requirements document - written to demonstrate what real requirements gathering looks like before building a system.

**Users**
- New account with unique email and email verification
- User profile with image, name, position, bio, phone, address
- Update profile information
- Password reset via email link (expires in 24 hours)
- JWT-based login with token refresh
- Brute force protection (account lock after 6 failed attempts)
- Role and permission-based access control (ACL)
- Two-factor authentication via SMS
- Activity tracking (IP, device, browser, date, action type)

**Customers**
- Manage customer info (name, address, status)
- Customer can be a person or an institution
- Search by name with pagination
- Export customer list to spreadsheet

**Invoices**
- Create and attach invoices to customers
- Download invoices as PDF
- Export invoices to spreadsheet

## Features

These show what's actually built so far in this project.

**Auth and Users**

- [Done] Login with JWT + MFA via SMS (Twilio)
- [Done] JWT token interceptor (auto-attach + refresh on 401)
- [Done] Logout
- [Done] User profile - update info
- [Plannedd] Register new account
- [Planned] Email verification on signup
- [Planned] User profile - update password
- [Planned] Account activity log
- [Planned] Password reset via email
- [Planned] Brute force protection (account lock)
- [Planned] Role and permission-based access control (ACL)
- [Planned] User profile - update avatar

> Note: MFA via SMS (Twilio) is implemented from the tutorial but will be removed before the public demo. Visitors should not need to share their phone number to try the app.

**Customers**

- [Done] Dashboard stats overview
- [Done] Add and manage customers
- [Done] Customer status badges (Active, Inactive, Pending)
- [Done] Search customers by name
- [Done] Pagination
- [Planned] Excel export for customer lists

**Invoices**

- [Done] Create new invoices
- [Done] Add invoices to a customer
- [Done] Download invoice as PDF (via window.print())
- [Done] Pagination
- [Planned] Excel export for invoice lists

## User Scenarios

### Admin (in progress)

> As an admin, I can log in with JWT, view the dashboard, update my profile, and work through customers and invoices as features are completed.

### Standard User (planned)

> As a standard user, I can view assigned customers and invoices based on my role permissions.

## Architecture

The app follows a clean client-server split. Docker is used locally for the database only - the frontend deploys directly to Vercel and the backend directly to Railway.

**Frontend (Angular)**

The browser sends user events to Angular components. Components delegate all data fetching to a Service Layer (CustomerService, UserService). Services pass through HTTP Interceptors, which automatically attach the JWT access token before any request leaves the browser. Responses are cached in memory where applicable. Invoice PDF export uses `window.print()`.

```
Browser
  └── Angular Components
      └── Services (CustomerService, UserService)
          └── HTTP Interceptors (attach JWT, handle 401 refresh)
              └── Cache (in-memory)
                  └── HTTP Request to Backend
```

**Backend (Spring Boot)**

Every HTTP request passes through the Spring Security filter chain before reaching any controller. The filters validate the JWT, check permissions, and reject unauthorised requests early. Requests then hit the Resource layer (REST controllers), the Service layer, then Repositories (JPA + JDBC) which talk to MySQL. Email verification (Office365 API) is planned but not yet complete. SMS verification via Twilio is implemented but planned for removal. Excel report generation via Apache POI is planned but not yet built.

```
HTTP Request
  └── Spring Security Filters (JWT validation, permission check)
      └── Resources (REST Controllers)
          └── Services
              └── Repositories (JPA + JDBC)
                  └── MySQL DB
```

**Infrastructure**

Locally, MySQL runs in a Docker container. In production, the backend deploys to Railway with MySQL as a managed Railway database.

```
Local
  └── Docker
      └── MySQL Container

Production
  └── Vercel (Frontend)
  └── Railway (Backend + MySQL DB)
```

## Login Flow

Login uses a two-token system: a short-lived access token and a longer-lived refresh token, both JWT.

```
User submits credentials
  └── Backend validates email + password
      └── If MFA enabled: Twilio sends SMS code to phone
          └── User submits SMS code
              └── Backend issues Access Token + Refresh Token
                  └── Angular stores both tokens in local storage
                      └── Token Interceptor attaches Access Token to every request
                          └── On 401 (expired): Interceptor silently uses Refresh Token to get a new Access Token
```

On the backend, Spring Security routes login through `UsernamePasswordAuthenticationFilter` > `ProviderManager` > `DaoAuthenticationProvider` > `UserDetailsService`, which loads the user from the database. A custom `CustomAuthorizationFilter` validates the JWT on every protected request.

## Engineering Highlights

These are patterns applied deliberately, not just to make things work.

**Type Safety**
- Generic HTTP response wrapper - `CustomHttpResponse<T>` gives every API response a consistent typed shape
- State machine via enum - `DataState { LOADING, LOADED, ERROR }` makes every possible UI state explicit and exhaustive
- Enum constants over magic strings - `Key.TOKEN = '[KEY] TOKEN'` prevents typos in local storage keys

**Architecture and Separation of Concerns**
- HTTP Interceptor as a cross-cutting concern - JWT injection and 401 token refresh happen in one place; no component needs to know about auth
- Route Guard - `authentication-guard.ts` centralises all auth checks; protected pages don't manage their own access logic
- Shell Layout Pattern - `shell.ts` wraps all authenticated routes in a single layout (navbar + router-outlet), so the navbar isn't duplicated across every page
- Standalone Component Architecture - each component declares its own imports with no shared NgModule, keeping dependencies explicit and tree-shakeable
- Functional Interceptor (`HttpInterceptorFn`) - uses `inject()` inside a plain function, the modern Angular pattern that avoids class boilerplate

**Reactive Programming (RxJS)**
- Observable pipeline composition - `.pipe(map, catchError, startWith)` chains keep async logic declarative and readable
- `switchMap` for dependent observables - route param changes cancel in-flight API requests automatically
- `startWith` for initial state - guarantees a loading state emission before the HTTP call resolves, no blank flashes

**State Management**
- Angular Signals for local UI state - `currentPage = signal<number>(0)` is reactive without needing RxJS for simple values
- Retain stale data during pagination - `startWith({ dataState: LOADED, appData: this.data() })` shows the previous page while the next one loads
- Immutable updates with spread - `{ ...response, data: { ...response.data } }` preserves unchanged state fields instead of mutating

**DRY and Code Quality**
- Centralised error handler - `private handleError(error: HttpErrorResponse)` in `user.ts` is reused by every service method
- Environment-based API URL - `environment.apiUrl` means one change switches between dev and prod
- Nested route hierarchy with guards - protected routes are children of `ShellComponent` in `app.routes.ts`, so the guard is applied once, not per route

## Getting Started (Frontend)

**Prerequisites:** Node.js 20+, Angular CLI 21

```bash
git clone https://github.com/your-username/techbridge-invoice-frontend
cd techbridge-invoice-frontend
npm install
ng serve
```

The app runs at `http://localhost:4200`. You'll need the backend running locally or pointed at a deployed instance via `src/environments/environment.ts`.

> Full backend setup (including IntelliJ environment variables and local Docker config) is in the backend repo's README.

## Getting Started (Backend)

Go checkout the backend repo [here.](https://github.com/ting11222001/TechBridge-Invoice)

## Deployment

| Service | Platform |
|---|---|
| Frontend | Vercel (auto-deploy from `main`) |
| Backend | Railway |
| Database | Railway (MySQL managed) |

Full deployment notes (including Railway DB seeding) coming soon. The information about setting up the backend project is in the backend repo's README.

## What's Next

**Features to add**

- [ ] Sortable table columns
- [ ] Form input validation
- [ ] Stats charts on the dashboard

**Frontend refactors**

- [ ] Refactor all possible signals in components
- [ ] Use Reactive Forms instead of `ngForm`
- [ ] Build simple reusable UI components
- [ ] Replace mock images with real Cloudinary integration
- [ ] Seed database with more appropriate mock data

**Backend improvements**

- [ ] Set up GitHub Actions CI/CD pipeline
- [ ] Remove Twilio SMS dependency (simplify auth for demo)
- [ ] Add database indexing for better query performance
- [ ] Explore gRPC or jOOQ

**Infrastructure**

- [ ] Full Vercel + Railway deployment with DB seeding docs
- [ ] Explore low-cost AWS deployment