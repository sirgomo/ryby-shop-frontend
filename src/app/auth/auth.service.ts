import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #token: BehaviorSubject<string> = new BehaviorSubject('');
  #userid: number = 0;
  #email: string = '';
  #role: string = '';
  constructor(private jwtService: JwtHelperService) { }
  setToken(tok: string) {
    this.#token.next(tok);

    const token = Object(this.#token.value).access_token;
    localStorage.setItem('token', token);
    const decoded = this.jwtService.decodeToken(token);
    console.log(decoded);
    this.#userid = decoded.sub;
    this.#email = decoded.username;
    this.#role = decoded.role;
  }
  logout() {
    this.#token.next('');
    localStorage.removeItem('token');
    this.#userid = 0;
    this.#email = '';
    this.#role = '';
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
