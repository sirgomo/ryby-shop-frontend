import { inject } from '@angular/core';
import { CanActivateFn  } from '@angular/router';
import { AuthService } from './auth.service';


export const routeGuard: CanActivateFn = (route, state) => {

  const role = localStorage.getItem('role');

    if(role === 'ADMIN')
    return true;

    return false;
};

