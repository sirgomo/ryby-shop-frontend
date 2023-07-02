import { Inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const userGuard: CanActivateFn = (route, state) => {
  const router: Router = Inject(Router);
  const role = localStorage.getItem('role');
  if(router === null || router === undefined)
    return false;

  if(role === 'ADMIN' || role === 'USER')
  return true;

  router.navigateByUrl('/');
  return false;
};
