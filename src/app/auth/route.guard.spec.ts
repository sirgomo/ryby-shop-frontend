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
    const mockRouter = {
      navigateByUrl: jest.fn(), // Mocking navigateByUrl method
      routerState: { snapshot: { root: {} } }, // Mocking routerState.snapshot.root
    };

    TestBed.configureTestingModule({
      imports: [JwtModule.forRoot({})],
      providers: [{ provide: Router, useValue: mockRouter }], // Providing the mockRouter
    });

    route = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true if user role is ADMIN', () => {
    localStorage.setItem('role', 'ADMIN');

    const result = routeGuard(route.routerState.snapshot.root, route.routerState.snapshot);

    expect(result).toBe(true);
    expect(route.navigateByUrl).not.toHaveBeenCalled(); // Verify that navigateByUrl was not called
  });
  it('should return false if user role is not ADMIN', () => {
    localStorage.removeItem('role');
    const mockNavigate = jest.fn();
    route.navigate = mockNavigate;

    const result = routeGuard(route.routerState.snapshot.root, route.routerState.snapshot);

    expect(result).toBe(false);
    expect(mockNavigate).toHaveBeenCalledWith(['/']); // Verify that navigate was called with ['/']
  });
});
