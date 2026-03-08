import { CanActivateFn, Router } from '@angular/router';
import { UserService } from './service/user';
import { inject } from '@angular/core';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

   if (userService.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};
