import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarComponent } from './toolbar.component';
import { AuthService } from 'src/app/auth/auth.service';
import { HelperService } from 'src/app/helper/helper.service';
import { JwtModule } from '@auth0/angular-jwt';
import { AppComponent } from 'src/app/app.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { SearchComponent } from 'src/app/search/search.component';
import { RouterTestingModule } from '@angular/router/testing';


describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let authService: AuthService;
  let helperService: HelperService;
  let fixture: ComponentFixture<ToolbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent, JwtModule.forRoot({ config: { tokenGetter: jest.fn() }}), MatToolbarModule, SearchComponent, MatIconModule,
         CommonModule, MatButtonModule, RouterModule, RouterTestingModule],
      providers: [AuthService, HelperService]
    });
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    helperService = TestBed.inject(HelperService);

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
    const logButt = fixture.nativeElement.querySelector('#showLogin');
    logButt.click();
    fixture.detectChanges();

    expect(helperService.getLoginWindow).toHaveBeenCalled();
  });

  it('should call logout method when logout is called', () => {
    jest.spyOn(authService, 'logout');
    component.helper.isLogged.set(true);
    fixture.detectChanges();
    const logoutButt = fixture.nativeElement.querySelector('#logout');
    logoutButt.click();
    fixture.detectChanges();
    expect(authService.logout).toHaveBeenCalled();
  });
});
