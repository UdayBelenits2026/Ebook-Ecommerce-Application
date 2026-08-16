import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-services';

export const publicGuard: CanActivateFn = () => {

  const authService = inject(AuthService);

  const router = inject(Router);

  if (!authService.isLoggedIn()) {

    return true;

  }

  if (authService.isAdmin()) {

    router.navigate(['/admin']);

    return false;

  }

  if (authService.isCustomer()) {

    router.navigate(['/customer/my-account']);

    return false;

  }

  return true;

};