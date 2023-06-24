import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { iLogin } from '../model/iLogin';
import { iRegisterUser } from '../model/iRegisterUser';
import { map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  #API = environment.api + 'auth'
  constructor(private readonly http: HttpClient) { }
  login(data: iLogin) {}
  createUser(data: iRegisterUser) {
    return this.http.post(this.#API, data).pipe(map(res => {
      console.log(res);
      return res;
    }));
  }
}
