import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

return router.createUrlTree(['/login']);
};
