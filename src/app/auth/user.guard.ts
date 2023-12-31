import { Inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const userGuard: CanActivateFn = (route, state) => {

  const role = localStorage.getItem('role');

  if(role === 'ADMIN' || role === 'USER')
  return true;


  return false;
};
