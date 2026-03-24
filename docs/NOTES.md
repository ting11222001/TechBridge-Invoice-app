# Working Notes

Personal reference notes, planning decisions, and terminology for TechBridge Invoice.

## Role and Permission Reference

Full permission set per role:

| Role | Permissions |
|---|---|
| `ROLE_USER` | `READ:USER` `READ:CUSTOMER` |
| `ROLE_MANAGER` | `READ:USER` `READ:CUSTOMER` `UPDATE:USER` `UPDATE:CUSTOMER` |
| `ROLE_ADMIN` | `READ:USER` `READ:CUSTOMER` `CREATE:USER` `CREATE:CUSTOMER` `UPDATE:USER` `UPDATE:CUSTOMER` |
| `ROLE_SYSADMIN` | `READ:USER` `READ:CUSTOMER` `CREATE:USER` `CREATE:CUSTOMER` `UPDATE:USER` `UPDATE:CUSTOMER` `DELETE:USER` `DELETE:CUSTOMER` |

<!-- --- -->

## Partner Invoice Services Detail

| Partner Type | Example Invoice Services | Typical Amount |
|---|---|---|
| **Business Donor** | Annual corporate partner program membership (includes listing + impact reporting) | $500 |
| **Business Donor** | Cost-recovery charge: donation documentation + tax receipt package | $150 |
| **Refurb Partner** | Annual verified partner listing fee | $300 |
| **Refurb Partner** | Platform onboarding and compliance check | $200 |
| **Request Partner** | Annual contribution: eligibility assessment and registration | $100 |
| **Request Partner** | Annual contribution: device request processing | $75 |

<!-- --- -->

## Business Requirements (Source of Truth)

Features derived from a mock business requirements document, written to demonstrate what real requirements gathering looks like before building a system.

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

<!-- --- -->

## User Scenarios (Planning Notes)

### Admin (in progress)

> As an admin, I can log in with JWT, view the dashboard, update my profile, and work through customers and invoices as features are completed.

### Standard User (planned)

> As a standard user, I can view assigned customers and invoices based on my role permissions.

<!-- --- -->

## Angular Setup Reference

Version compatibility reference: https://angular.dev/reference/versions

**Useful CLI commands**

```bash
# Create new project
ng new <project name>

# Generate component (no test file)
ng generate c component/login --skip-tests=true

# Generate service
ng g service service/user --skip-tests=true

# Generate interface
ng g interface interface/user
```

**Bootstrap install**
```bash
npm i bootstrap
```
Add to `angular.json` under `"styles"`:
```json
"node_modules/bootstrap/dist/css/bootstrap.min.css"
```

Docs: https://getbootstrap.com/docs/5.0/getting-started/introduction/

Handling request failure: https://angular.dev/guide/http/making-requests#handling-request-failure

<!-- --- -->

## Authentication Notes

### Where refresh tokens happen

Refresh lives in the Angular interceptor, not the component.

```
User makes request
  └── Interceptor attaches access token
      └── Backend verifies token
          └── if expired → 401
              └── Interceptor catches 401
                  └── Call /refresh/token with refresh token
                      └── Get new access token
                          └── Retry original request
```

Interceptor pattern:
```
catchError(401)
  → call refresh token endpoint
  → update access token
  → retry request
```

### JwtHelperService

Used for small UI conveniences only, not for real security. The backend controls actual security.

Install: `npm i @auth0/angular-jwt` (https://www.npmjs.com/package/@auth0/angular-jwt)

Use cases:
- Hide login page if user is already authenticated
- Navbar state
- Route guards

`JwtHelperService._isTokenExpired` treats a missing token as expired, source: https://github.com/auth0/angular2-jwt

**Architecture rule:**
- Use `JwtHelperService` only for route guards / UI
- Handle refresh entirely in the interceptor
- Backend controls real security

## Login Flow

```
User submits credentials
  └── Backend validates email + password
      └── If MFA enabled: Twilio sends SMS code
          └── User submits SMS code
              └── Backend issues Access Token + Refresh Token
                  └── Angular stores both in localStorage
                      └── Token Interceptor attaches Access Token to every request
                          └── On 401: Interceptor silently refreshes → retries original request
```

On the backend, Spring Security routes login through `UsernamePasswordAuthenticationFilter` → `DaoAuthenticationProvider` → `UserDetailsService`. A custom `CustomAuthorizationFilter` validates the JWT on every protected request.

### Route Guards

https://angular.dev/guide/routing/route-guards#canactivate

<!-- --- -->

## Libraries

| Library | Purpose | Install |
|---|---|---|
| `@auth0/angular-jwt` | JWT decode + expiry checking for route guards / UI | `npm i @auth0/angular-jwt` |
| `bootstrap` | Bootstrap 5 CSS | `npm i bootstrap` |


<!-- --- -->

## Useful Links

- Angular version compatibility: https://angular.dev/reference/versions
- Angular installation: https://angular.dev/installation
- Angular open source guides: https://github.com/layzeedk
- RxJS fundamentals: https://this-is-learning.github.io/rxjs-fundamentals-course/
- Node.js: https://nodejs.org/en/download
- nvm (Windows): https://github.com/coreybutler/nvm-windows
