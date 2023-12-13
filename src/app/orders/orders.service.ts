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
  #api = environment.api + 'order';

  currentVersandStatusSig = signal(BESTELLUNGSSTATUS.INBEARBEITUNG);
  currentOrderStateSig = signal(BESTELLUNGSSTATE.BEZAHLT);
  bestellungen : BehaviorSubject<iBestellung[]> = new BehaviorSubject<iBestellung[]>([]);
  bestellung = signal<iItemActions<any>>({item: null, action: 'getall' })
  items$ = combineLatest([toObservable(this.currentVersandStatusSig), toObservable(this.currentOrderStateSig), toObservable(this.helper.artikelProSiteSig),
     toObservable(this.helper.pageNrSig), toObservable(this.bestellung)]).pipe(
    switchMap(([verStat, orderStat, itemsQuan, sitenr, bestellung]) => {
      if (bestellung.action === 'donothing')
      return this.bestellungen.asObservable();

      return this.getBestellungen(verStat, orderStat, itemsQuan, sitenr);
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



    if(this.#role && this.#role === 'ADMIN') {
      return this.http.post<[[], number]>(this.#api+'/all/get/'+sitenr, settings).pipe(map((res) => {
        this.helper.paginationCountSig.set(res[1]);
        this.bestellungen.next(res[0])
        return res[0];
      }),
      catchError((err) => {
        this.error.newMessage(err.message);
        return [];
      })
      )}
    return of([]);
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
  getBestellungBeiKundeNr(kunde: number): Observable<iBestellung[]> {
    return this.http.get<[iBestellung[], number]>(`${this.#api}/kunde/${kunde}`).pipe(
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
}
