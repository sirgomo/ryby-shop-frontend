import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorService } from '../error/error.service';
import { iBestellung } from '../model/iBestellung';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  #role = localStorage.getItem('role');
  #api = environment.api + 'order';
  constructor(private http: HttpClient, private error: ErrorService) { }

  getBestellungen(): Observable<iBestellung[]> {
    if(this.#role && this.#role === 'ADMIN') {
      return this.http.get<iBestellung[]>(this.#api+'/all/get').pipe(map((res) => {
        return res;
      }),
      catchError((err) => {
        this.error.newMessage(err.message);
        return [];
      })
      )
    }
    return of([]);
  }
  getBestellungById(id: number): Observable<iBestellung> {
    return this.http.get<iBestellung>(this.#api+'/'+id).pipe(map((res) => {
      return res;
    }),
    catchError((err) => {
      this.error.newMessage(err.message);
      return of({} as iBestellung);
    })
    )
  }

}
