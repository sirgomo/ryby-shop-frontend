import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, Observable, catchError, map, of, tap } from 'rxjs';
import { iProduct } from 'src/app/model/iProduct';
import { iWarenEingang } from 'src/app/model/iWarenEingang';
import { iWareneingangProduct } from 'src/app/model/iWareneingangProduct';
import { environment } from 'src/environments/environment';
import { AddEditBuchungComponent } from './add-edit-buchung/add-edit-buchung.component';
import { ErrorService } from 'src/app/error/error.service';

@Injectable({
  providedIn: 'root'
})
export class WareneingangService {
  API_P = environment.api + 'product';
  API = environment.api + 'waren-eingang-buchen';
  currentWarenEingangSig = signal<AddEditBuchungComponent | null>(null);
  currentProductsInBuchungSig = signal<iWareneingangProduct[]>([]);
  lieferantIdSig = signal(0);
  warenEingangItem = signal<iWarenEingang>({} as iWarenEingang);
  warenEingangItems = toSignal<iWarenEingang[], iWarenEingang[]>(this.getAllWareneingangBuchungen(), { initialValue: []});
  warenEingangSig = computed(() => {
    const items = this.warenEingangItems();
    const item = this.warenEingangItem();
    if(item.id && item.id > 0) {
      const index = items.findIndex((tmp) => tmp.id === item.id);

       const newItems = items.slice(0);
       if(index !== -1) {
        newItems[index] = item;
        return newItems;
       }

         newItems.push(item);
         return newItems;
    }

    if(item.id && item.id < 0) {
      const id = item.id;
      const index = items.findIndex((tmp) => tmp.id == Math.abs(id));
      items.splice(index, 1);
      const newItms = items.slice(0);

      return newItms;
    }
    return items;
  })
  constructor(private http: HttpClient, private err: ErrorService) { }

  getAllWareneingangBuchungen(): Observable<iWarenEingang[]> {
    return this.http.get<iWarenEingang[]>(this.API).pipe(tap(res => {
      if(res.length > 0) {
        return res;
      }
      return [];
    }))
  }
  getProduktsForWarenEingang(lieferantId: number) {
    return this.http.get<iProduct[]>(`${this.API_P}/lieferant/${lieferantId}`);
  }
  getWareneingangBuchungbeiId(id: number): Observable<iWarenEingang> {
    return this.http.get<iWarenEingang>(`${this.API}/${id}`);
  }

  createWareneingangBuchung(wareneingang: any): Observable<iWarenEingang> {
    return this.http.post<iWarenEingang>(this.API, wareneingang).pipe(map((res) => {
      this.warenEingangItem.set(res);
      return res;
    }), catchError((err) => {
      this.err.newMessage(err.message);
      return of({} as iWarenEingang);
    }));
  }

  updateWareneingangBuchung(wareneingang: any): Observable<iWarenEingang> {
    return this.http.put<iWarenEingang>(this.API, wareneingang).pipe(tap((res) => {
      if(res.id)
      this.warenEingangItem.set(res);
    }), catchError((err) => {
      this.err.newMessage(err.message);
      return of({} as iWarenEingang);
    }));
  }

  deleteWareneingangBuchung(id: number): Observable<{affected: number, raw: string}> {
    return this.http.delete<{affected: number, raw: string}>(`${this.API}/${id}`).pipe(tap((res) => {
      if(res.affected === 1) {
        const item : iWarenEingang = {} as iWarenEingang;
        item.id = -id;
        this.warenEingangItem.set(item);
      }
      return res;
    }), catchError((err) => {
      this.err.newMessage('Du kannst nur Buchung löschen wenn die leer ist!');
      return of({affected: 0, raw: ''});
    }));
  }

  addProductToWarenEingang(wareneingangId: number, product: iWareneingangProduct): Observable<iWareneingangProduct> {
    return this.http.post<iWareneingangProduct>(`${this.API}/${wareneingangId}/products`, product)
    .pipe(
      catchError((err) => {
        this.err.newMessage(err.error.message);
        return of({} as iWareneingangProduct);
      })
    );
  }

  updateProductInWarenEingang(wareneingangId: number, productId: number, product: iWareneingangProduct): Observable<iWareneingangProduct> {
    return this.http.patch<iWareneingangProduct>(`${this.API}/${wareneingangId}/products/${productId}`, product)
    .pipe(
      catchError((err) => {
        this.err.newMessage(err.error.message);
        return of({} as iWareneingangProduct);
      })
    );
  }

  deleteProductFromWarenEingang(wareneingangId: number, productId: number): Observable<{ affected: number, raw: string }> {
    return this.http.delete<{ affected: number, raw: string } >(`${this.API}/${wareneingangId}/products/${productId}`).pipe(
      catchError((err) => {
        this.err.newMessage(err.error.message);
        return of({ affected: 0, raw: '' } );
      })
    );
  }
}
