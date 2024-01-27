import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserLoginComponent } from './user-login.component';
import { UserService } from '../user.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserRegisterComponent } from '../user-register/user-register.component';
import { of } from 'rxjs';
import { ErrorService } from 'src/app/error/error.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtModule } from '@auth0/angular-jwt';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


describe('UserLoginComponent', () => {
  let component: UserLoginComponent;
  let fixture: ComponentFixture<UserLoginComponent>;
  let userService: UserService;
  let authService: AuthService;
  let dialog: MatDialog;
  let dialogRef: MatDialogRef<UserLoginComponent>;
  let errorService: ErrorService;
  let snackBar: MatSnackBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports: [ UserLoginComponent, UserRegisterComponent, HttpClientTestingModule, JwtModule.forRoot({

      }), MatDialogModule, MatFormFieldModule, MatInputModule, BrowserModule, BrowserAnimationsModule, FormsModule, ReactiveFormsModule ],
      providers: [
        UserService,
        AuthService,
        MatDialog,
        ErrorService,
        { provide: MatDialogRef<UserLoginComponent>, useValue: {} },
        MatSnackBar
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLoginComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    authService = TestBed.inject(AuthService);
    dialog = TestBed.inject(MatDialog);
    dialogRef = TestBed.inject(MatDialogRef);
    errorService = TestBed.inject(ErrorService);
    snackBar = TestBed.inject(MatSnackBar);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login method', () => {
    const loginSpy = jest.spyOn(component, 'login');
    component.login();
    expect(loginSpy).toHaveBeenCalled();
  });

  it('should call login method with valid login data', () => {
    component.loginData.email = 'test@example.com';
    component.loginData.password = 'password';
    const loginSpy = jest.spyOn(userService, 'login').mockReturnValue(of());
    component.login();
    expect(loginSpy).toHaveBeenCalledWith(component.loginData, dialogRef);
  });

  it('should not call login method with invalid login data', () => {
    component.loginData.email = 'test@example.com';
    component.loginData.password = 'pass';
    const loginSpy = jest.spyOn(userService, 'login').mockReturnValue(of());
    component.login();
    expect(loginSpy).not.toHaveBeenCalled();
  });
  it('should open dialog when registerUser method is called', () => {

    const openSpy = jest.spyOn(dialog, 'open').mockReturnValue({ afterClosed: jest.fn().mockReturnValue(of()) } as any);
    Object.defineProperty(dialogRef, 'close', { value: jest.fn() });
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.width = '800px';
    conf.height = '700px';
    component.registerUser();
    expect(openSpy).toHaveBeenCalledWith(UserRegisterComponent, conf);
    expect(dialogRef.close).toHaveBeenCalled();
  });


  it('should close dialog when close method is called', () => {
    Object.defineProperty(dialogRef, 'close', { value: jest.fn() });
    component.close();
    expect(dialogRef.close).toHaveBeenCalled();
  });
});
