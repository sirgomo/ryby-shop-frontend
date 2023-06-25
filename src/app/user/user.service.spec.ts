import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { iLogin } from '../model/iLogin';
import { iRegisterUser } from '../model/iRegisterUser';
import { ErrorService } from '../error/error.service';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { UserLoginComponent } from './user-login/user-login.component';
import { environment } from 'src/environments/environment';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';


describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let errorService: ErrorService;
  let snackBar: MatSnackBar;
  let authService: AuthService;
  let dialogRef: MatDialogRef<UserLoginComponent>;
  let jwtService: JwtHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, JwtModule.forRoot({
        config: {
          tokenGetter: () => {return localStorage.getItem('token')}
        }
      })],
      providers: [ErrorService, AuthService, MatSnackBar, { provide:  MatDialogRef<UserLoginComponent>, useValue: {}}, JwtHelperService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    errorService = TestBed.inject(ErrorService);
    snackBar = TestBed.inject(MatSnackBar);
    authService = TestBed.inject(AuthService);
    jwtService = TestBed.inject(JwtHelperService);
    dialogRef = TestBed.inject(MatDialogRef<UserLoginComponent>);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a POST request to login', () => {
    const data: iLogin = {
      email: 'test',
      password: 'test123'
    };

    const mockResponse = 'token';

    service.login(data, dialogRef).subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(authService.setToken).toHaveBeenCalledWith(mockResponse);
      expect(dialogRef.close).toHaveBeenCalled();
    });

    const req = httpMock.expectOne(`${environment.api}auth`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should handle error when making a POST request to login', () => {
    const data: iLogin = {
      email: 'test',
      password: 'test123'
    };

    const mockError = { error: { message: 'Error message' } };

    jest.spyOn(errorService, 'newMessage');
    Object.defineProperty(dialogRef, 'close', { value: jest.fn() });

    service.login(data, dialogRef).subscribe({
      error: () => {
        expect(errorService.newMessage).toHaveBeenCalledWith(mockError.error.message);
        expect(dialogRef.close).not.toHaveBeenCalled();
      }
    });

    const req = httpMock.expectOne(`${environment.api}auth`);
    expect(req.request.method).toBe('POST');
    req.flush(mockError);
  });

  it('should make a POST request to create a new user', () => {
    const data: iRegisterUser = {
      vorname: 'test',
      email: 'test@test.com',
      password: 'test123',
      nachname: '',
      telefon: '',
      role: '',
      registrierungsdatum: '',
      treuepunkte: 0,
      adresseStrasse: '',
      adresseHausnummer: '',
      adresseStadt: '',
      adressePostleitzahl: '',
      adresseLand: ''
    };

    const mockResponse = 1;

    jest.spyOn(snackBar, 'open');

    service.createUser(data).subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(snackBar.open).toHaveBeenCalledWith('Jetzt kannst du dich einlogen!', 'Ok', { duration: 3000 });
    });

    const req = httpMock.expectOne(`${environment.api}auth/reg`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should handle error when making a POST request to create a new user', () => {
    const data: iRegisterUser = {
      vorname: 'test',
      email: 'test@test.com',
      password: 'test123',
      nachname: '',
      telefon: '',
      role: '',
      registrierungsdatum: '',
      treuepunkte: 0,
      adresseStrasse: '',
      adresseHausnummer: '',
      adresseStadt: '',
      adressePostleitzahl: '',
      adresseLand: ''
    };

    const mockError = { error: { message: ['Error message'] } };

    jest.spyOn(errorService, 'newMessage');

    service.createUser(data).subscribe({
      error: () => {
        expect(errorService.newMessage).toHaveBeenCalledWith(mockError.error.message[0]);
      }
    });

    const req = httpMock.expectOne(`${environment.api}auth/reg`);
    expect(req.request.method).toBe('POST');
    req.flush(mockError);
  });
});
