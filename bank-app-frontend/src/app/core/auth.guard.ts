import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    void router.navigate(['/login']);
    return false;
  }

  const role = authService.role();
  const allowedRoles = route.data['roles'] as string[] | undefined;

  if (!allowedRoles || allowedRoles.includes(role ?? '')) {
    return true;
  }

  void router.navigate(['/dashboard']);
  return false;
};
