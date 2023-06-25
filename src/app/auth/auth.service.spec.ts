import { TestBed } from '@angular/core/testing';
import { JwtHelperService, JwtModule } from "@auth0/angular-jwt";

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtHelperService: JwtHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JwtModule.forRoot({})],
      providers: [JwtHelperService]
    });
    service = TestBed.inject(AuthService);
    jwtHelperService = TestBed.inject(JwtHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set token and update user details', () => {
    const token = 'sample-token';
    const decodedToken = {
      sub: 1,
      username: 'test@example.com',
      role: 'admin'
    };

    jest.spyOn(jwtHelperService, 'decodeToken').mockReturnValue(decodedToken);
    jest.spyOn(service['helper'].isLogged, 'set');

    service.setToken(token);

    expect(service.getToken()).toBe(token);
    expect(service.getEmail()).toBe(decodedToken.username);
    expect(service.getRole()).toBe(decodedToken.role);
    expect(service.getUserId()).toBe(decodedToken.sub);
    expect(service['helper'].isLogged.set).toHaveBeenCalledWith(true);
  });

  it('should clear token and user details on logout', () => {
    jest.spyOn(service['helper'].isLogged, 'set');

    service.logout();

    expect(service.getToken()).toBe('');
    expect(service.getEmail()).toBe('');
    expect(service.getRole()).toBe('');
    expect(service.getUserId()).toBe(0);
    expect(service['helper'].isLogged.set).toHaveBeenCalledWith(false);
  });
});
