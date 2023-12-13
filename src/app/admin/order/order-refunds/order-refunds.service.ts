import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { get } from 'http';
import { BehaviorSubject, Observable, catchError, combineLatest, map, of, switchMap, tap } from 'rxjs';
import { ErrorService } from 'src/app/error/error.service';
import { HelperService } from 'src/app/helper/helper.service';
import { iBestellung } from 'src/app/model/iBestellung';
import { iItemActions } from 'src/app/model/iItemActions';
import { iProduktRueckgabe } from 'src/app/model/iProduktRueckgabe';
import { OrdersService } from 'src/app/orders/orders.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderRefundsService {
  #api = environment.api + 'shop-refund';
  refunds: BehaviorSubject<iProduktRueckgabe[]> = new BehaviorSubject<iProduktRueckgabe[]>([]);
  actionsSig = signal<iItemActions<any>>({ item: null, action: 'donothing' });
  refunds$ = combineLatest([toObservable(this.helperService.artikelProSiteSig), toObservable(this.helperService.pageNrSig), toObservable(this.actionsSig)]).pipe(
    switchMap(([count, sitenr, act]) => {
      if( act.action === 'donothing')
        return this.refunds.asObservable();

      if ( act.action === 'delete') {
        return this.deleteRefundById(act.item.id);
      }


      return this.getAllShopRefunds(count, sitenr);
    }),
    map((res) => {
      return res;
    })
  )

  constructor(private readonly httpClient: HttpClient, private readonly errorService: ErrorService, private helperService: HelperService, private snack: MatSnackBar, private orderService: OrdersService) { }
  createRefund(refund: iProduktRueckgabe): Observable<iProduktRueckgabe> {
    return this.httpClient.post<iProduktRueckgabe>(`${this.#api}`, refund).pipe(
      tap((res) => {
        if(res.id === -1) {
          this.errorService.newMessage('Etwas ist schiefgelaufen, Produkt refund wurde nicht gespeichert');
        } else {
          //refund created, we need to update order for refund updates
          refund.bestellung.refunds = [...refund.bestellung.refunds, refund];
          //update orders
          this.setOrder(refund.bestellung);
          const ref = [...this.refunds.value, res];
          this.refunds.next(ref);
          this.actionsSig.set({ item: null, action: 'donothing' });
        }

      }),
      catchError((err) => {
        console.log(err);
       this.errorService.newMessage(err.message);
        return of({id: -1} as iProduktRueckgabe);
      })
    )
  }
  getRefundById(id: number): Observable<iProduktRueckgabe> {
    return this.httpClient.get<iProduktRueckgabe>(`${this.#api}/id`);
  }
  getAllShopRefunds(count: number, sitenr: number): Observable<iProduktRueckgabe[]> {


    return this.httpClient.get<[iProduktRueckgabe[], number]>(`${this.#api}/${count}/${sitenr}`).pipe(
      map((res) => {
        this.helperService.paginationCountSig.set(res[1]);
        this.refunds.next(res[0]);

        return res[0];
      }),
      catchError((err) => {
        this.errorService.newMessage(err.message);
        return [];
      })
    );
  };

  deleteRefundById(id: number): Observable<iProduktRueckgabe[]> {
    return this.httpClient.delete<{raw: any, affected: number| null}>(`${this.#api}/${id}`).pipe(
      map((res) => {
        if(res.affected) {
          const items = this.refunds.value;
          //we need order to update it
          const bestll = items.filter((tmp) => tmp.id === id)[0].bestellung;
          const filtred = items.filter((tmp) => tmp.id !== id);
          const newItems = filtred.slice(0);
          //if we have more refunds give them back to order
          bestll.refunds = newItems.filter((tmp) => tmp.bestellung.id === bestll.id);
          //set modified order
          this.setOrder(bestll);
          this.refunds.next(newItems);
          this.snack.open('Refund wurde gelöscht', 'Ok', { duration: 1500 });
          this.actionsSig.set({ item: null, action: 'donothing'});
          return newItems;
        }
        this.errorService.newMessage(JSON.stringify(res));
        return this.refunds.value;
      }),
      catchError((err) => {
        this.errorService.newMessage(err.message);
        return this.refunds.asObservable();
      })
    );
  }
  setOrder(bestll: iBestellung) {
    const currentOrders = this.orderService.bestellungen.value;
    const index = currentOrders.findIndex((tmp) => tmp.id === bestll.id);
    if(index === -1) {
      this.errorService.newMessage('Index nicht gefunden, bestellung unvollständig!');
      return;
    }
    const newOrderList = currentOrders.slice(0);
    newOrderList[index] = bestll;
    this.orderService.bestellungen.next(newOrderList);
    this.orderService.bestellung.set({item: null, action: 'donothing'})
  }
}
