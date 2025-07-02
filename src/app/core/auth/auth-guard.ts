import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const loggedInUser = sessionStorage.getItem('userLoginCredential');

  const router = inject(Router);

  if (loggedInUser && state.url.includes('auth')) {
    router.navigate(['simplesolve']);
    return false;
  }

  if (!loggedInUser && state.url.includes('simplesolve')) {
    router.navigate(['auth']);
    return false;
  }

  return true;
};
