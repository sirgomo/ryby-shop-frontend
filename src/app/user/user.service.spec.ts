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
import { UserRegisterComponent } from './user-register/user-register.component';
import { iUserData } from '../model/iUserData';


describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let errorService: ErrorService;
  let snackBar: MatSnackBar;
  let authService: AuthService;
  let dialogRef: MatDialogRef<UserLoginComponent>;
  let dialogRefRegi: MatDialogRef<UserRegisterComponent>;
  let jwtService: JwtHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, JwtModule.forRoot({
        config: {
          tokenGetter: () => {return localStorage.getItem('token')}
        }
      })],
      providers: [ErrorService, AuthService, MatSnackBar, { provide:  MatDialogRef<UserLoginComponent>, useValue: {}},
        { provide:  MatDialogRef<UserRegisterComponent>, useValue: {}}, JwtHelperService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    errorService = TestBed.inject(ErrorService);
    snackBar = TestBed.inject(MatSnackBar);
    authService = TestBed.inject(AuthService);
    jwtService = TestBed.inject(JwtHelperService);
    dialogRef = TestBed.inject(MatDialogRef<UserLoginComponent>);
    dialogRefRegi = TestBed.inject(MatDialogRef<UserRegisterComponent>);
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
      vorname: "John",
      nachname: "Doe",
      password: "password123",
      email: "johndoe@example.com",
      telefon: "1234567890",
      role: "user",
      registrierungsdatum: "2023-07-08",
      treuepunkte: 100,
      l_strasse: "Delivery Street",
      l_hausnummer: "456",
      l_stadt: "Delivery City",
      l_postleitzahl: "54321",
      l_land: "Delivery Country",
      adresseStrasse: "Main Street",
      adresseHausnummer: "123",
      adresseStadt: "Cityville",
      adressePostleitzahl: "12345",
      adresseLand: "Countryland",
      shipping_name: ''
    };

    const mockResponse: iUserData = {
      id: null,
      vorname: "John",
      nachname: "Doe",
      email: "johndoe@example.com",
      telefon: "1234567890",
      registrierungsdatum: "2023-07-08",
      treuepunkte: 100,
      adresse: {
        strasse: "Main Street",
        hausnummer: "123",
        stadt: "Cityville",
        postleitzahl: "12345",
        land: "Countryland"
      },
      lieferadresse: {
        shipping_name: '',
        strasse: "Main Street",
        hausnummer: "123",
        stadt: "Cityville",
        postleitzahl: "12345",
        land: "Countryland"
      }
    };

    jest.spyOn(snackBar, 'open');

    service.createUser(data, dialogRefRegi).subscribe(res => {

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
      adresseLand: '',
      shipping_name: ''
    };

    const mockError = { error: { message: ['Error message'] } };

    jest.spyOn(errorService, 'newMessage');

    service.createUser(data, dialogRefRegi).subscribe({
      error: () => {
        expect(errorService.newMessage).toHaveBeenCalledWith(mockError.error.message[0]);
      }
    });

    const req = httpMock.expectOne(`${environment.api}auth/reg`);
    expect(req.request.method).toBe('POST');
    req.flush(mockError);
  });
});
