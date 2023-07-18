import { Inject, inject } from '@angular/core';
import { CanActivateFn, Router  } from '@angular/router';


export const routeGuard: CanActivateFn = (route, state) => {
  const router: Router = Inject(Router);
  const role = localStorage.getItem('role');

  if(router === null || router === undefined)
    return false;

    if(role === 'ADMIN')
    return true;


    router.navigateByUrl('/');
    return false;
};

