import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Route, Router, RouterStateSnapshot } from '@angular/router';

import { routeGuard } from './route.guard';
import { AuthService } from './auth.service';
import { JwtModule } from '@auth0/angular-jwt';

describe('routeGuard', () => {

  let route: Router;
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => routeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JwtModule.forRoot({})],
      providers: [  Router],
    });

    route = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
  it('should return true if user role is ADMIN', () => {
    localStorage.setItem('role', 'ADMIN');



    const result = routeGuard(route.routerState.snapshot.root, route.routerState.snapshot );

    expect(result).toBe(true);

  });

  it('should return false if user role is not ADMIN', () => {
    localStorage.removeItem('role');

    const result = routeGuard(route.routerState.snapshot.root, route.routerState.snapshot );

    expect(result).toBe(false);

  });

});
