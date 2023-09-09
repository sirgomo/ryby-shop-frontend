import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, computed, signal } from '@angular/core';
import { Observable, catchError, map, of, shareReplay, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorService } from '../error/error.service';
import { iBestellung } from '../model/iBestellung';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  #role = localStorage.getItem('role');
  #api = environment.api + 'order';
  itemsSig = toSignal(this.getBestellungen(),{ initialValue: [] as iBestellung[] });
  item = signal<iBestellung>({} as iBestellung);
  ordersSig =  computed(() => {

    const tmpItems = this.itemsSig();
    if(this.item() && this.item().id !== undefined) {
      const index = tmpItems.findIndex((item) => item.id === this.item().id);
      if(index !== -1) {
        const newItems = tmpItems;
        newItems[index] = this.item();
        return newItems;
      }
    }
    return tmpItems;
  })
  constructor(private http: HttpClient, private error: ErrorService) { }

  getBestellungen(): Observable<iBestellung[]> {
    if(this.#role && this.#role === 'ADMIN') {
      return this.http.get<iBestellung[]>(this.#api+'/all/get').pipe(map((res) => {
        return res;
      }),
      catchError((err) => {
        this.error.newMessage(err.message);
        return [];
      }),
      shareReplay(1)
      )}
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
  updateOrder(order: iBestellung): Observable<iBestellung> {
    return this.http.patch<iBestellung>(`${this.#api}/update`, order).pipe(map((res) => {
      if(res.id) {
        this.item.set(res);
      }
      return res;
    }),
    catchError((err) => {
      this.error.newMessage(err.message);
      return of({} as iBestellung);
    }))
  }

}
