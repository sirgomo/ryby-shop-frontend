import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";
import { HelperService } from '../helper/helper.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #token: BehaviorSubject<string> = new BehaviorSubject('');
  #userid: number = 0;
  #email: string = '';
  #role: string = '';
  constructor(private jwtService: JwtHelperService, private readonly helper: HelperService) { }
  setToken(tok: string) {
    this.#token.next(tok);

    const token = Object(this.#token.value).access_token;
    localStorage.setItem('token', token);
    const decoded = this.jwtService.decodeToken(token);
    this.#userid = decoded.sub;
    this.#email = decoded.username;
    this.#role = decoded.role;
    this.helper.isLogged.set(true);
  }
  logout() {
    this.#token.next('');
    localStorage.removeItem('token');
    this.#userid = 0;
    this.#email = '';
    this.#role = '';
    this.helper.isLogged.set(false);
  }
  getToken() {
    return this.#token.value;
  }
  getEmail() {
    return this.#email;
  }
  getRole() {
    return this.#role;
  }
  getUserId(){
    return this.#userid;
  }
}
