import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map, tap } from 'rxjs';
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
  constructor(private http : HttpClient) { }

  getAllWarehouses(): Observable<iLager[]> {
    return this.http.get<iLager[]>(this.#api).pipe(tap(res => {
      if(res)
        this.warehousesSub.next(res);
    }));
  }

  createWarehouse(newLager: iLager): Observable<iLager> {
    return this.http.post<iLager>(this.#api, newLager);
  }

  getWarehouseById(id: number): Observable<iLager> {
    const url = `${this.#api}/${id}`;
    return this.http.get<iLager>(url);
  }

  updateWarehouse(updatedLager: iLager): Observable<iLager> {
    return this.http.put<iLager>(this.#api, updatedLager);
  }

  deleteWarehouse(id: number): Observable<{raw: any; affected: number}> {
    const url = `${this.#api}/${id}`;
    return this.http.delete<{raw: any, affected: number}>(url);
  }
}
