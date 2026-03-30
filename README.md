# TechBridge: Invoice Module (Frontend)

TechBridge is a device donation platform connecting businesses, refurbishers, and schools. This repo is the Invoice module. It lets program staff manage partner organisations, issue invoices, and track payments. Built with Angular, Spring Boot, and JWT auth, with role-based access across four staff levels.

![Frontend CI](https://github.com/ting11222001/TechBridge-Invoice-app/actions/workflows/frontend-ci.yml/badge.svg)

[About the TechBridge project](https://tech-bridge-landing-page.vercel.app/) · [Invoice Module Live Demo](https://tech-bridge-invoice-app.vercel.app/) · [Invoice Module (Backend repo)](https://github.com/ting11222001/TechBridge-Invoice) · Donation Module (coming soon)

<!-- --- -->

## Demo

![Demo GIF](demo/demo.gif)

<!-- --- -->

## Table of Contents

- [Why TechBridge needs an invoice module](#why-techbridge-needs-an-invoice-module)
- [Users of this Invoice platform](#users-of-this-invoice-platform)
- [Example Invoice Services](#example-invoice-services)
- [What's Built](#whats-built)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Engineering Highlights](#engineering-highlights)
- [Getting Started](#getting-started)
- [Docs](#docs)
- [What's Next](#whats-next)

<!-- --- -->

## Why TechBridge needs an invoice module

TechBridge is a non-profit that coordinates device donations from businesses to students in need. It connects three types of partner organisations, each with a financial relationship with TechBridge that needs to be tracked:

| Partner Type | Who they are | Why TechBridge invoices them |
|---|---|---|
| **Business Donor** | Companies donating end-of-life devices (e.g. Optus, Telstra) | Annual corporate partner program membership (includes listing + impact reporting) + cost-recovery charge for donation documentation and tax receipt package |
| **Refurb Partner** | IT recyclers who wipe and refurbish devices | Annual verified partner listing fee |
| **Request Partner** | Schools and NGOs receiving devices | Small contribution to cover eligibility assessment and admin costs |

TechBridge Invoice gives program admins a single place to manage these partner organisations, issue invoices, track payment status, and export financial records for compliance reporting.

> This project explores the invoicing module as a focused standalone build. The full TechBridge platform (device lifecycle, donor/partner portals, allocation tracking) is planned to be built separately with ASP.NET Core + React.

<!-- --- -->

## Users of this Invoice platform

| Term | Meaning |
|---|---|
| `USER` | A TechBridge staff account, the people logging into this app (admins, coordinators, assistants) |
| `CUSTOMER` | A partner organisation being invoiced, Business Donors, Refurb Partners, or Request Partners |

> **Users** are internal staff who log in and use the app.
> **Customers** are the external partner organisations you manage and invoice.

Internal staff have four access levels: Program Assistant (view only) → Program Coordinator (view + update) → Program Admin (full except delete) → Platform Owner (full access). See [docs/NOTES.md/##Role and Permission Reference](docs/NOTES.md) for the full permission table.

| Role | Who they are | What they can do |
|---|---|---|
| `ROLE_USER` | Program Assistant | View staff accounts and partner organisations |
| `ROLE_MANAGER` | Program Coordinator | View and update staff accounts and partner organisations |
| `ROLE_ADMIN` | Program Admin | Full access except delete |
| `ROLE_SYSADMIN` | Platform Owner | Full access including delete |

<!-- --- -->

## Example Invoice Services

| Partner Type | Example Invoice Services | Typical Amount |
|---|---|---|
| **Business Donor** | Annual corporate partner program membership (includes listing + impact reporting) | $500 |
| **Business Donor** | Cost-recovery charge: donation documentation + tax receipt package | $150 |
| **Refurb Partner** | Annual verified partner listing fee | $300 |
| **Refurb Partner** | Platform onboarding and compliance check | $200 |
| **Request Partner** | Annual contribution: eligibility assessment and registration | $100 |
| **Request Partner** | Annual contribution: device request processing | $75 |

<!-- --- -->

## What's Built

| Done | Planned |
|---|---|
| JWT login + MFA via SMS | Register + email verification |
| Token interceptor (auto-attach + 401 refresh) | Password reset via email |
| Logout | Account activity log |
| User profile: update info | Update avatar |
| Dashboard stats overview | Stats charts |
| Customer list with search + pagination | Excel export |
| Add / manage customers | Sortable columns |
| Customer status badges | Form validation |
| Invoice list with pagination | Excel export |
| Create new invoices | |
| Download invoice as PDF | |
| GitHub Actions CI (tests + build on every push) | |

<!-- --- -->

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 21, Tailwind CSS 4 |
| Backend | Spring Boot 4.0.2 (Java 17), Spring Security, Lombok |
| Auth | JWT (auth0 java-jwt), Twilio MFA/SMS |
| Database | MySQL 8.0 |
| Deploy | Vercel (frontend), Railway (backend + DB), GitHub Actions CI |

<!-- --- -->

## Architecture

**Frontend**
```
Browser
  └── Angular Components
      └── Services (CustomerService, UserService)
          └── HTTP Interceptors (attach JWT, handle 401 refresh)
              └── HTTP Request to Backend
```

**Backend**
```
HTTP Request
  └── Spring Security Filters (JWT validation, permission check)
      └── REST Controllers
          └── Services
              └── Repositories (JPA + JDBC)
                  └── MySQL DB
```

**Infrastructure**
```
Local:       Docker → MySQL Container
Production:  Vercel (Frontend) + Railway (Backend + MySQL)
CI:          GitHub Actions → runs tests + production build on every push to main
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for deeper system design notes.

<!-- --- -->

## Engineering Highlights

**Type Safety**
- `CustomHttpResponse<T>` - generic wrapper gives every API response a consistent typed shape
- `DataState { LOADING, LOADED, ERROR }` - state machine enum makes every UI state explicit and exhaustive
- `Key.TOKEN` enum constants - prevents typos in localStorage keys

**Architecture**
- HTTP Interceptor - JWT injection and 401 refresh in one place; no component handles auth
- Route Guard - `authentication-guard.ts` centralises all access control
- Shell Layout Pattern - `shell.ts` wraps all authenticated routes (navbar + router-outlet) once, not per page
- Standalone Components - each component declares its own imports; no shared NgModule
- Functional Interceptor (`HttpInterceptorFn`) - uses `inject()` in a plain function, avoiding class boilerplate

**RxJS**
- `.pipe(map, catchError, startWith)` - keeps async logic declarative and readable
- `switchMap` - route param changes cancel in-flight requests automatically
- `startWith` - guarantees a loading state before the HTTP call resolves; no blank flashes

**State Management**
- Angular Signals - `currentPage = signal<number>(0)` for simple local UI state without RxJS overhead
- Stale-while-loading - `startWith({ dataState: LOADED, appData: this.data() })` shows the previous page while the next loads
- Immutable updates - `{ ...response, data: { ...response.data } }` preserves unchanged state fields

**Code Quality**
- Centralised `handleError` reused across all service methods
- `environment.apiUrl` - one change switches between dev and prod
- Guards applied once at the shell level, not duplicated per route

**CI/CD**
- GitHub Actions runs tests and production build on every push to `main`
- Vercel and Railway auto-deploy from `main` — broken builds never reach production

<!-- --- -->

## Getting Started

**Prerequisites:** Node.js 24, Angular CLI 21
```bash
git clone https://github.com/ting11222001/TechBridge-Invoice-app
cd TechBridge-Invoice-app
npm install
ng serve
```

Opens at `http://localhost:4200`. Point `src/environments/environment.ts` at a local or deployed backend.

> Backend setup (IntelliJ env vars, Docker DB config) is in the [backend repo](https://github.com/ting11222001/TechBridge-Invoice).

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for full Railway + Vercel setup and DB seeding.

<!-- --- -->

## Docs

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - system design, component structure, and data flow
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) - Railway + Vercel setup, environment variables, and DB seeding
- [docs/NOTES.md](docs/NOTES.md) - role/permission table and dev notes

<!-- --- -->

## What's Next

| Done | Planned |
|---|---|
| GitHub Actions CI/CD pipeline | Sortable table columns + form validation |
| Full Vercel + Railway deployment docs with DB seeding | Stats charts on dashboard |
| | Reactive Forms (replace `ngForm`) |
| | Refactor components to Angular Signals |
| | Cloudinary avatar upload + real mock data seeding |
| | Remove Twilio SMS dependency (simplify demo auth) |
| | Database seeding scripts |
| | Database indexing for query performance |
| | Explore gRPC or jOOQ on the backend |