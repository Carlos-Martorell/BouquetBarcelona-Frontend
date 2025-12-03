import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
