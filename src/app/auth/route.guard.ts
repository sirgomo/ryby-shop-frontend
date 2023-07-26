import { Inject, inject } from '@angular/core';
import { CanActivateFn, Router  } from '@angular/router';


export const routeGuard: CanActivateFn = (route, state) => {

  const role = localStorage.getItem('role');


    if(role === 'ADMIN')
    return true;

    return false;
};

