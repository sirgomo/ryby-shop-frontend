import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, WritableSignal, computed, signal } from '@angular/core';
import { Observable, catchError, combineLatest, map, of, shareReplay, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ErrorService } from '../error/error.service';
import { BESTELLUNGSSTATE, BESTELLUNGSSTATUS, iBestellung } from '../model/iBestellung';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { iOrderGetSettings } from '../model/iOrderGetSettings';
import { HelperService } from '../helper/helper.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  #role = localStorage.getItem('role');
  #api = environment.api + 'order';

  currentVersandStatusSig = signal(BESTELLUNGSSTATUS.INBEARBEITUNG);
  currentOrderStateSig = signal(BESTELLUNGSSTATE.BEZAHLT);


  items$ = combineLatest([toObservable(this.currentVersandStatusSig), toObservable(this.currentOrderStateSig), toObservable(this.helper.artikelProSiteSig), toObservable(this.helper.pageNrSig)]).pipe(
    switchMap(([verStat, orderStat, itemsQuan, sitenr]) => this.getBestellungen(verStat, orderStat, itemsQuan, sitenr)),
    map((res) => {
      return res
    })
  );
  itemsSig = toSignal(this.items$);
  item = signal<iBestellung>({} as iBestellung);
  ordersSig =  computed(() => {

    const tmpItems = this.itemsSig();
    if(tmpItems && this.item() && this.item().id !== undefined) {
      const index = tmpItems.findIndex((item) => item.id === this.item().id);
      if(index !== -1) {
        const newItems = tmpItems;
        newItems[index] = this.item();
        return newItems;
      }
    }
    return tmpItems;
  })
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
        this.helper.paginationCountSig.set(res[1])
        return res[0];
      }),
      catchError((err) => {
        this.error.newMessage(err.message);
        return [];
      }),
      shareReplay(1)
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
        this.item.set(res);
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
      return res[0];
    }),
    catchError((err) => {
      this.error.newMessage(err.message);
      return [];
    }),
    )
  }
}
