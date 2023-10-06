import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { iLogin } from '../model/iLogin';
import { iRegisterUser } from '../model/iRegisterUser';
import { BehaviorSubject, EMPTY, Observable, catchError, combineLatest, map, of, switchMap, tap, throwIfEmpty } from 'rxjs';
import { ErrorService } from '../error/error.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth/auth.service';
import { UserLoginComponent } from './user-login/user-login.component';
import { MatDialogRef } from '@angular/material/dialog';
import { iUserData } from '../model/iUserData';
import { iNewPassword } from '../model/iNewPassword';
import { UserRegisterComponent } from './user-register/user-register.component';


@Injectable({
  providedIn: 'root'
})
/**
 * The UserService class provides methods for user authentication and user management.
 * It communicates with the server API to perform various operations such as logging in, registering a new user, getting user details, updating user information, and changing passwords.
 *
 * @class
 * @public
 */
export class UserService {
  /**
   * The base API URL for authentication.
   *
   * @private
   * @readonly
   */
  #API = environment.api + 'auth';

  /**
   * The base API URL for user management.
   *
   * @private
   * @readonly
   */
  #API_USER = environment.api + 'users';

  errorHandle = inject(ErrorService);
  /**
   * The UserData BehaviorSubject stores the current user data and allows for observing changes to the user data.
   *
   * @private
   */
  userData: BehaviorSubject<iUserData> = new BehaviorSubject<iUserData>({
    id: null,
    vorname: '',
    nachname: '',
    email: '',
    telefon: '',
    registrierungsdatum: '',
    treuepunkte: 0,
    adresse: {
      strasse: '',
      hausnummer: '',
      stadt: '',
      postleitzahl: '',
      land: '',
    },
    lieferadresse: {
      shipping_name: '',
      strasse: '',
      hausnummer: '',
      stadt: '',
      postleitzahl: '',
      land: '',
    }
  });

  /**
   * The user$ Observable allows for subscribing to changes in the user data.
   *
   * @public
   * @readonly
   */
  user$ = this.userData.asObservable().pipe(
    tap((res) => {
      if (res.id === null) {
        return this.getUserDetails();
      }
      return res;
    })
  );

  /**
   * Constructs a new instance of the UserService class.
   *
   * @constructor
   * @param {HttpClient} http - The HttpClient service for making HTTP requests.
   * @param {MatSnackBar} snackBar - The MatSnackBar service for displaying snack bar notifications.
   * @param {AuthService} authService - The AuthService service for managing authentication.
   */
  constructor(
    private readonly http: HttpClient,
    private readonly snackBar: MatSnackBar,
    private readonly authService: AuthService
  ) {}

  /**
   * Logs in a user with the provided login data.
   *
   * @public
   * @param {iLogin} data - The login data containing the email and password.
   * @param {MatDialogRef<UserLoginComponent>} dialRef - The MatDialogRef for the user login dialog.
   * @returns {Observable<string>} An Observable containing the authentication token.
   */
  login(data: iLogin, dialRef: MatDialogRef<UserLoginComponent>): Observable<string> {
    return this.http.post<string>(this.#API, data).pipe(
      tap((res) => {
        this.authService.setToken(res);
        dialRef.close();
        return res;
      }),
      catchError((error) => {
        console.log(error)
        this.errorHandle.newMessage(error.error.message);
        return EMPTY;
      })
    );
  }

  /**
   * Registers a new user with the provided user data.
   *
   * @public
   * @param {iRegisterUser} data - The user data containing the registration details.
   * @param {MatDialogRef<UserRegisterComponent>} ref - The MatDialogRef for the user registration dialog.
   * @returns {Observable<iUserData>} An Observable containing the registered user data.
   */
  createUser(data: iRegisterUser, ref: MatDialogRef<UserRegisterComponent>): Observable<any> {
    return this.http.post<iUserData>(this.#API + '/reg', data).pipe(
      map((res) => {
        if (res.id !== null && isFinite(res.id)) {
          this.snackBar.open('Jetzt kannst du dich einloggen!', 'Ok', { duration: 3000 });
          ref.close();
          return res;
        }

        this.errorHandle.newMessage(Object(res).message);
        return EMPTY;
      }),
      catchError((error) => {
        this.errorHandle.newMessage(error.error.message[0]);
        return EMPTY;
      })
    );
  }

  /**
   * Retrieves the details of the currently logged-in user.
   *
   * @public
   * @returns {Observable<iUserData>} An Observable containing the user data.
   */
  getUserDetails(): Observable<iUserData> {
    return this.http.get<iUserData>(this.#API_USER + `/${this.authService.getUserId()}`).pipe(
      map((res) => {
        this.userData.next(res);
        return res;
      }),
      catchError((err) => {
        this.errorHandle.newMessage(err.message);
        return EMPTY;
      })
    );
  }

  /**
   * Updates the user information with the provided data.
   *
   * @public
   * @param {iUserData} data - The updated user data.
   * @returns {Observable<iUserData>} An Observable containing the updated user data.
   */
  updateUser(data: iUserData): Observable<iUserData> {
    return this.http.patch(this.#API_USER, data).pipe(
      map((res) => {
        if (res === 1) {
          this.userData.next(data);
          this.snackBar.open('Die Änderungen wurden gespeichert', 'Ok', { duration: 3000 });
        }
        return this.userData.value;
      }),
      catchError((err) => {
        this.errorHandle.newMessage(Object(err).message);
        return EMPTY;
      })
    );
  }

  /**
   * Changes the user's password with the provided new password data.
   *
   * @public
   * @param {iNewPassword} pass - The new password data containing the current password and the new password.
   * @returns {Observable<any>} An Observable containing the response from the server.
   */
  changePassword(pass: iNewPassword): Observable<any> {
    return this.http.patch(this.#API_USER + '/pass', pass).pipe(
      tap((res) => {
        if (res !== 1) {
          this.errorHandle.newMessage(Object(res).message);
          return EMPTY;
        }

        this.snackBar.open('Password wurde geändert', 'Ok', { duration: 2000 });
        return res;
      }),
      catchError((err) => {
        console.log(err);
        this.errorHandle.newMessage(err.error.message[0]);
        return EMPTY;
      })
    );
  }
}
