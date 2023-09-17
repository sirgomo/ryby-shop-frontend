import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";
import { HelperService } from '../helper/helper.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #token: BehaviorSubject<string> = new BehaviorSubject('');
  #userid: number = 0;
  #email: string = '';
  #role: string = '';
  constructor(private jwtService: JwtHelperService, private readonly helper: HelperService, private readonly router: Router) { }
  /**
   * Sets the authentication token and extracts the user ID, email, and role from the token.
   * @param tok The authentication token.
   */
  setToken(tok: string) {
    this.#token.next(tok);

    const token = Object(this.#token.value).access_token;
    localStorage.setItem('token', token);
    const decoded = this.jwtService.decodeToken(token);
    this.#userid = decoded.sub;
    this.#email = decoded.username;
    this.#role = decoded.role;
    this.helper.isLogged.set(true);
    this.helper.setMenu(this.#role);
    localStorage.setItem('role', this.#role);
    localStorage.setItem('userid', this.#userid.toString());
  }

  /**
   * Logs out the user by resetting the token, removing it from local storage, and clearing the user ID, email, and role.
   */
  logout() {
    this.#token.next('');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userid');
    this.#userid = 0;
    this.#email = '';
    this.#role = '';
    this.helper.isLogged.set(false);
    this.helper.setMenu('');
    this.router.navigateByUrl('/');
  }

  /**
   * Returns the authentication token.
   * @returns The authentication token.
   */
  getToken() {
    return this.#token.value;
  }

  /* Returns the user's email.
   * @returns The user's email.
   */
  getEmail() {
    return this.#email;
  }

  /**
   * the user's role.
   * @returns The user's role.
   */
  getRole() {
    return this.#role;
  }

  /**
   * Returns the user's ID.
   * @returns The user's ID.
   */
  getUserId(){
    return this.#userid;
  }
  isTokenExpired() {
    const token = localStorage.getItem('token');
    if(token) {
      const decoded = this.jwtService.decodeToken(token);
      if(decoded.exp  * 1000 < Date.now())
        {

          this.logout();
        }
    }

  }
}
