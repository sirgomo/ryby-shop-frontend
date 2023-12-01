import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, catchError, combineLatest, forkJoin, map, of, startWith, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { iEbayAllOrders } from '../model/ebay/orders/iEbayAllOrders';
import { iRefunds } from '../model/iRefund';
import { iEbayOrder } from '../model/ebay/orders/iEbayOrder';


@Injectable({
  providedIn: 'root'
})
export class EbayService {
  #api = environment.api + 'ebay'
  #apiRefund = environment.api + 'refund';
  ebayItems: BehaviorSubject<iEbayAllOrders | undefined> = new BehaviorSubject<iEbayAllOrders | undefined>(undefined);
  itemsSoldByEbaySig = this.ebayItems.asObservable().pipe(map((res) => {
    if(res) {
      return of(res);
    }
    return this.getItemsSoldBeiEbay();
  }))

  constructor(private readonly httpService: HttpClient) { }

  getLinkForUserConsent() {
    return this.httpService.get<{address: string}>(this.#api+'/consent');
  }
  getItemsSoldBeiEbay(): Observable<iEbayAllOrders> {

    return this.httpService.get<iEbayAllOrders>(this.#api).pipe(
      switchMap((res) => {
        const refunds$: Observable<iRefunds[]>[] = [];
        for (const item of res.orders) {
         const tmp$ = this.httpService.get<iRefunds[]>(`${this.#apiRefund}/${item.orderId}`).pipe(
          catchError((err) => {
            return of([{id: -1} as iRefunds] );
          })
         );
         refunds$.push(tmp$);
        }

         return forkJoin(refunds$).pipe(
          map((refunds) => {
           const items = res.orders.map((item, index) => {

            let amount = 0;

            for (let i = 0; i < refunds[index].length; i++) {
              if(refunds[index][i].refund_items)
              for (const refund of refunds[index][i].refund_items) {
                amount += Number(refund.amount);
              }
            if(refunds[index][0].id !== -1)
            amount += Number(refunds[index][i].amount);

          }

            if(refunds[index][0].id === -1)
              return item;

           //   refunds[index][0].amount = amount;
              return {
                ...item,
                refunds: refunds
              } as unknown as iEbayOrder;
            })
            res.orders = items;
            this.ebayItems.next(res);
            return res;
          }
         ))
      }))
    ;
  }

  getItemsFromEbay() {}
}
