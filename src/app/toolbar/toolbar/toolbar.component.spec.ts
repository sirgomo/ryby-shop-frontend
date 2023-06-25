import { TestBed } from '@angular/core/testing';
import { ToolbarComponent } from './toolbar.component';
import { AuthService } from 'src/app/auth/auth.service';
import { HelperService } from 'src/app/helper/helper.service';
import { JwtModule } from '@auth0/angular-jwt';
import { AppComponent } from 'src/app/app.component';
import { signal } from '@angular/core';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let authService: AuthService;
  let helperService: HelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [JwtModule.forRoot({})],
      providers: [AuthService, HelperService]
    });
    authService = TestBed.inject(AuthService);
    helperService = TestBed.inject(HelperService);
    component = new ToolbarComponent(helperService, authService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set isLogged to true if user is logged in', () => {
    helperService.isLogged.set(true);
    jest.spyOn(helperService, 'isLogged');

    expect(component.isLogged()).toBe(true);
  });

  it('should set isLogged to false if user is not logged in', () => {
    jest.spyOn(helperService, 'isLogged').mockReturnValue(false);
    expect(component.isLogged()).toBe(false);
  });

  it('should call getLoginWindow method when showLoginPanel is called', () => {
    jest.spyOn(helperService, 'getLoginWindow');
    component.showLoginPanel();
    expect(helperService.getLoginWindow).toHaveBeenCalled();
  });

  it('should call logout method when logout is called', () => {
    jest.spyOn(authService, 'logout');
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
  });
});
