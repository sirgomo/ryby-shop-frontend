import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, catchError, combineLatest, map, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorService } from '../error/error.service';
import { BESTELLUNGSSTATE, BESTELLUNGSSTATUS, iBestellung } from '../model/iBestellung';
import { toObservable } from '@angular/core/rxjs-interop';
import { iOrderGetSettings } from '../model/iOrderGetSettings';
import { HelperService } from '../helper/helper.service';
import { iItemActions } from '../model/iItemActions';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  #role = localStorage.getItem('role');
  #userid = Number(localStorage.getItem('userid'));
  #api = environment.api + 'order';
  #ebay_api = environment.api + 'ebay-sold';

  currentVersandStatusSig = signal(BESTELLUNGSSTATUS.INBEARBEITUNG);
  currentOrderStateSig = signal(BESTELLUNGSSTATE.BEZAHLT);
  bestellungen : BehaviorSubject<iBestellung[]> = new BehaviorSubject<iBestellung[]>([]);
  bestellung = signal<iItemActions<any>>({item: null, action: 'getall' })
  items$ = combineLatest([
    toObservable(this.currentVersandStatusSig),
    toObservable(this.currentOrderStateSig),
    toObservable(this.helper.artikelProSiteSig),
    toObservable(this.helper.pageNrSig),
    toObservable(this.bestellung)]).pipe(
    switchMap(([verStat, orderStat, itemsQuan, sitenr, bestellung]) => {
     
      if (bestellung.action === 'donothing')
        return this.bestellungen.asObservable();
      
      //if(verStat === BESTELLUNGSSTATUS.EBAY_ORDERS)
      //  return this.getEbayBestellungen(itemsQuan, sitenr);

   
      if(this.#role && this.#role === 'ADMIN')
        return this.getBestellungen(verStat, orderStat, itemsQuan, sitenr);

      if(this.#role && this.#role !== 'ADMIN')
        return this.getBestellungBeiKundeNr(this.#userid, verStat, orderStat, itemsQuan, sitenr);

        return this.bestellungen.asObservable();
    }),
    map((res) => {
      return res
    })
  );
  constructor(private http: HttpClient, private error: ErrorService, private helper: HelperService) { }

  getBestellungen(versStatus: string, orderState: string, itemsQuanity: number, sitenr: number): Observable<iBestellung[]> {
    const settings: iOrderGetSettings = {
      state: orderState,
      status: versStatus,
      itemsProSite: itemsQuanity,
    };

    if(versStatus.length < 3)
      return of([]);
    
      return this.http.post<[[], number]>(this.#api+'/all/get/'+sitenr, settings).pipe(map((res) => {
        this.helper.paginationCountSig.set(res[1]);
        this.bestellungen.next(res[0])
        return res[0];
      }),
      catchError((err) => {
        this.error.newMessage(err.message);
        return [];
      })
      )
  }
  getEbayBestellungen(itemQuanity: number, siteNr = 1) {
    const settings: iOrderGetSettings = {
      state: 'EBAY',
      status: 'EBAY',
      itemsProSite: itemQuanity,
      sitenr: siteNr
    };
      return this.http.post<[any[], number]>(this.#ebay_api+'/orders/'+siteNr, settings).pipe(map((res) => {
        console.log(res);
        this.helper.paginationCountSig.set(res[1]);
       const items: iBestellung[] = [];
       res[0].forEach((item) => {
        const tmp: any = {};
        tmp.id = item.orderId;
        tmp.varsandnr = item.orderId;
        tmp.status = item.payment_status;
        tmp.gesamtwert = item.price_total;
        tmp.bestelldatum = item.creationDate;
        tmp.produkte = item.items;
        tmp.refunds = item.refunds;
        tmp.ebay = 1;
        items.push(tmp);
       })
        this.bestellungen.next(items);
        return items;
      }),
      catchError((err) => {
        this.error.newMessage(err.message);
        return [];
      })
      )
  }
  getBestellungById(id: number): Observable<iBestellung> {
    if(id === 0)
      return of({} as iBestellung);


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
        const current = this.bestellungen.value;
        const index = current.findIndex((tmp) => tmp.id === res.id);
        if(index === -1)
          this.error.newMessage('Etwas ist schiefgelaufen, Index für update wurde nicht gefunden');

        const newCurrent = current.slice(0);
        newCurrent[index] = res;
        this.bestellungen.next(newCurrent);
      }
      return res;
    }),
    catchError((err) => {
      this.error.newMessage(err.message);
      return of({} as iBestellung);
    }))
  }
  getBestellungBeiKundeNr(kunde: number, verStat: string, orderStat:string, itemsQuan:number, sitenr:number): Observable<iBestellung[]> {
    const settings: iOrderGetSettings = {
      state: orderStat,
      status: verStat,
      itemsProSite: itemsQuan,
      sitenr: sitenr
    };
    return this.http.post<[iBestellung[], number]>(`${this.#api}/kunde/${kunde}`, settings).pipe(
      map((res) => {
  
        this.helper.paginationCountSig.set(res[1]);
        this.bestellungen.next(res[0])
      return res[0];
    }),
    catchError((err) => {
      this.error.newMessage(err.message);
      return [];
    }),
    )
  }
  createOwnOrder(order: iBestellung) {
    return this.http.post(`${this.#api}/own-order`, order).pipe(
      catchError((err) => {
        this.error.newMessage('Eigenesverbrauch kann nicht gespeichert werden \n' + err.message);
        return of({});
      })
    );
  }
}
