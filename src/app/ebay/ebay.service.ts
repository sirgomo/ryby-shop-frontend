import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, switchMap } from 'rxjs';
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
  itemsSoldByEbaySig = signal(this.getItemsSoldBeiEbay());
  constructor(private readonly httpService: HttpClient) { }

  getLinkForUserConsent() {
    return this.httpService.get<{address: string}>(this.#api+'/consent');
  }
  getItemsSoldBeiEbay(): Observable<iEbayAllOrders> {
    return this.httpService.get<iEbayAllOrders>(this.#api).pipe(
      switchMap((res) => {
        const refunds$: Observable<iRefunds>[] = [];
        for (const item of res.orders) {
         const tmp$ = this.httpService.get<any>(`${this.#apiRefund}/${item.orderId}`).pipe(
          catchError((err) => {
            console.log(err);
            return of({id: -1} as iRefunds);
          })
         );
         refunds$.push(tmp$);
        }

         return forkJoin(refunds$).pipe(
          map((refunds) => {
           const items = res.orders.map((item, index) => {

            let amount = 0;
            if(refunds[index].refund_items)
            for (const refund of refunds[index].refund_items) {
              amount += Number(refund.amount);
            }
            amount += Number(refunds[index].amount);
            refunds[index].amount = amount;

            if(refunds[index].id === -1)
              return item;


              return {
                ...item,
                refund: refunds[index]
              } as unknown as iEbayOrder;
            })
            res.orders = items;
            return res;
          }
         ))
      }))
    ;
  }

  getItemsFromEbay() {}
}
