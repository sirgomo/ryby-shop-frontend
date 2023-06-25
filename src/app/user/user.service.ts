import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { iLogin } from '../model/iLogin';
import { iRegisterUser } from '../model/iRegisterUser';
import { EMPTY, catchError, map, tap } from 'rxjs';
import { ErrorService } from '../error/error.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth/auth.service';
import { DialogRef } from '@angular/cdk/dialog';
import { UserLoginComponent } from './user-login/user-login.component';
import { MatDialogRef } from '@angular/material/dialog';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  errorHandle = inject(ErrorService);
  #API = environment.api + 'auth'
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
  createUser(data: iRegisterUser) {
    return this.http.post<number>(this.#API+'/reg', data).pipe(
      map(res => {
        this.snackBar.open('Jetzt kannst du dich einlogen!', 'Ok', { duration: 3000 });
        return res;
      }),
      catchError((error) => {
        this.errorHandle.newMessage(error.error.message[0])
      return EMPTY;
      })
    );
  }
}
