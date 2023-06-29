import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { iLogin } from '../model/iLogin';
import { iRegisterUser } from '../model/iRegisterUser';
import { BehaviorSubject, EMPTY, catchError, combineLatest, map, of, switchMap, tap, throwIfEmpty } from 'rxjs';
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
export class UserService {
  errorHandle = inject(ErrorService);
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
    l_strasse: '',
    l_hausnummer: '',
    l_stadt: '',
    l_postleitzahl: '',
    l_land: '',
  },

  });
  user$ = this.userData.asObservable().pipe(tap((res) => {
    if(res.id === null)
      return this.getUserDetails();

      return res;
  }))
  #API = environment.api + 'auth'
  #API_USER = environment.api + 'users'
  constructor(private readonly http: HttpClient, private readonly snackBar: MatSnackBar, private readonly authService: AuthService) { }
  login(data: iLogin, dialRef: MatDialogRef<UserLoginComponent>) {
    return this.http.post<string>(this.#API, data).pipe(
    tap(res => {
      this.authService.setToken(res);
      dialRef.close();
      return res;
    }),
    catchError((error) => {
      this.errorHandle.newMessage(error.error.message)
    return EMPTY;
    })
    );
  }
  createUser(data: iRegisterUser, ref: MatDialogRef<UserRegisterComponent>) {
    return this.http.post<iUserData>(this.#API+'/reg', data).pipe(
      map(res => {
        if(res.id !== null && isFinite(res.id)) {
          this.snackBar.open('Jetzt kannst du dich einlogen!', 'Ok', { duration: 3000 });
          ref.close();
          return res;
        }
        Object(res).message
        this.errorHandle.newMessage(Object(res).message)
        return EMPTY;
      }),
      catchError((error) => {
        this.errorHandle.newMessage(error.error.message[0])
      return EMPTY;
      })
    );
  }
  getUserDetails() {
    console.log('id ' + this.authService.getUserId())

    return this.http.get<iUserData>(this.#API_USER+`/${this.authService.getUserId()}`).pipe(map((res) => {
      console.log(res);
      this.userData.next(res)
      return res;
    }));

  }
  updateUser(data: iUserData) {
    return this.http.patch(this.#API_USER, data).pipe(tap(res => {
      console.log(res);
      if(res === 1) {
        this.userData.next(data)
      }
    }))
  }
  changePassword(pass: iNewPassword) {
    return this.http.patch(this.#API_USER+'pass', pass).pipe(tap(res => {
      console.log(res)
    }))
  }
}
