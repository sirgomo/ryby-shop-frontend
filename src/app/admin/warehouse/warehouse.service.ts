import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, combineLatest, map, of, tap } from 'rxjs';
import { ErrorService } from 'src/app/error/error.service';
import { iLager } from 'src/app/model/iLager';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  #api = environment.api + 'lager';
  warehousesSub : BehaviorSubject<iLager[]> = new BehaviorSubject<iLager[]>([]);

  warehouses$ = combineLatest([this.warehousesSub.asObservable(), this.getAllWarehouses()]).pipe(
    map(([alt, newL]) => {
        if(alt.length === 0)
          return newL;

          return alt;
    })
  )
  constructor(private http : HttpClient, private errorService: ErrorService) { }

  getAllWarehouses(): Observable<iLager[]> {
    return this.http.get<iLager[]>(this.#api).pipe(tap(res => {
      if(res)
        this.warehousesSub.next(res);
    }));
  }

  createWarehouse(newLager: iLager): Observable<iLager> {
    return this.http.post<iLager>(this.#api, newLager).pipe(tap((res) => {
      if(res)
        {
          const items = this.warehousesSub.value;
          const newitem = items.slice(0);
          newitem.push(res);
          this.warehousesSub.next(newitem);
        }

        return res;
    }),
    catchError((err) => {
      this.errorService.newMessage(err.message);
      return of({} as iLager);
    })
    );
  }

  getWarehouseById(id: number): Observable<iLager> {
    const url = `${this.#api}/${id}`;
    return this.http.get<iLager>(url);
  }

  updateWarehouse(updatedLager: iLager): Observable<iLager> {
    return this.http.put<iLager>(this.#api, updatedLager).pipe(tap(res => {
      if(res && res.id) {
        const items = this.warehousesSub.value;
        const index = items.findIndex((tmp) => tmp.id === res.id);
        const newItems = items.slice(0);
        if(index === -1)
          this.errorService.newMessage('Update schiefgelaufen, index wurde nicht gefunden!');

          newItems[index] = res;
          this.warehousesSub.next(newItems);
      }
    }));
  }

  deleteWarehouse(id: number): Observable<{raw: any; affected: number}> {
    const itmes = this.warehousesSub.value;
    const index = itmes.findIndex((tmp) => tmp.id === id);

    if(index === -1 || itmes[index].lagerorte && itmes[index].lagerorte.length === 0)
      this.errorService.newMessage('Item kann nicht entfernt werden, item wurde nicht gefunden!');


    return this.http.delete<{raw: any, affected: number}>(`${this.#api}/${id}`).pipe(tap(res => {
      if(res && res.affected === 1) {
        const newItems = itmes.filter((tmp) => tmp.id  !== id);
        this.warehousesSub.next(newItems);
      } else {

        this.errorService.newMessage('Etwas ist schief gelaufen!');
      }
    }),
    catchError((err) => {

      this.errorService.newMessage('Etwas ist schief gelaufen!');
      throw err;
    })
    );
  }
}
