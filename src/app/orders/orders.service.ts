import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  #role = localStorage.getItem('role');
  #api = environment.api + 'order';
  constructor(private http: HttpClient) { }

  getBestellungen() {
    if(this.#role && this.#role === 'ADMIN') {
      return this.http.get(this.#api+'/all').pipe(map((res) => {

      }))
    }

  }

}
