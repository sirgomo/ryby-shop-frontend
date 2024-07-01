import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, catchError, combineLatest, forkJoin, map, of, startWith, switchMap, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { iEbayAllOrders } from '../model/ebay/orders/iEbayAllOrders';
import { iRefunds } from '../model/iRefund';
import { iEbayOrder } from '../model/ebay/orders/iEbayOrder';
import { ErrorService } from '../error/error.service';
import { HelperService } from '../helper/helper.service';
import { toObservable } from '@angular/core/rxjs-interop';


@Injectable({
  providedIn: 'root'
})
export class EbayService {
  #api = environment.api + 'ebay'
  #apiRefund = environment.api + 'refund';

  ebayItems: BehaviorSubject<iEbayAllOrders | null> = new BehaviorSubject<iEbayAllOrders | null>(null);
  itemsSoldByEbay$ = combineLatest([ toObservable(this.helperService.pageNrSig)]).pipe(switchMap(() => {
    

      return this.getItemsSoldBeiEbay();
    
  }))

  constructor(private readonly httpService: HttpClient, private errorService: ErrorService, private helperService: HelperService) { }

  getLinkForUserConsent() {
    return this.httpService.get<{address: string}>(this.#api+'/consent');
  }
  getItemsSoldBeiEbay(): Observable<iEbayAllOrders | null> {

    return this.httpService.get<iEbayAllOrders>(this.#api+'/50/'+this.helperService.pageNrSig()).pipe(
      switchMap((res) => {
        if(Object(res).status === 404) {
          return of(null);
        }
        console.log(res.orders);
        if(!res.orders || res.orders.length === 0) {
          res.orders = [];
          this.ebayItems.next(res);
          return of(res);
        }

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
