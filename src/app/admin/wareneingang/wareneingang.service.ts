import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, of, tap } from 'rxjs';
import { iProduct } from 'src/app/model/iProduct';
import { iWarenEingang } from 'src/app/model/iWarenEingang';
import { iWareneingangProduct } from 'src/app/model/iWareneingangProduct';
import { environment } from 'src/environments/environment';
import { AddEditBuchungComponent } from './add-edit-buchung/add-edit-buchung.component';

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
    if(item.id) {
      const index = items.findIndex((tmp) => tmp.id === item.id);

       const newItems = items.slice(0);
       newItems[index] = item;
      return newItems;
    }

    return items;
  })
  constructor(private http: HttpClient) { }

  getAllWareneingangBuchungen(): Observable<iWarenEingang[]> {
    return this.http.get<iWarenEingang[]>(this.API).pipe(tap(res => {
      console.log(res);
      if(res.length > 0) {
        return res;
      }
      return [];
    }))
  }
  getProduktsForWarenEingang(lieferantId: number) {
    console.log(this.lieferantIdSig())
    return this.http.get<iProduct[]>(`${this.API_P}/lieferant/${lieferantId}`);
  }
  getWareneingangBuchungbeiId(id: number): Observable<iWarenEingang> {
    return this.http.get<iWarenEingang>(`${this.API}/${id}`);
  }

  createWareneingangBuchung(wareneingang: any): Observable<iWarenEingang> {
    return this.http.post<iWarenEingang>(this.API, wareneingang).pipe(tap((res) => {
      if(res.id)
        this.warenEingangItem.set(res);
    }));
  }

  updateWareneingangBuchung(wareneingang: any): Observable<iWarenEingang> {
    return this.http.put<iWarenEingang>(this.API, wareneingang).pipe(tap((res) => {
      if(res.id)
      this.warenEingangItem.set(res);
    }));
  }

  deleteWareneingangBuchung(id: number): Observable<number> {
    return this.http.delete<number>(`${this.API}/${id}`);
  }

  addProductToWarenEingang(wareneingangId: number, product: iWareneingangProduct): Observable<iWareneingangProduct> {
    return this.http.post<iWareneingangProduct>(`${this.API}/${wareneingangId}/products`, product);
  }

  updateProductInWarenEingang(wareneingangId: number, productId: number, product: iWareneingangProduct): Observable<iWareneingangProduct> {
    return this.http.patch<iWareneingangProduct>(`${this.API}/${wareneingangId}/products/${productId}`, product);
  }

  deleteProductFromWarenEingang(wareneingangId: number, productId: number): Observable<number> {
    return this.http.delete<number>(`${this.API}/${wareneingangId}/products/${productId}`);
  }
}
