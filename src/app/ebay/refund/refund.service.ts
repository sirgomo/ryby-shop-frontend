import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ErrorService } from '../../error/error.service';
import { iEbayRefunds } from '../../model/ebay/transactionsAndRefunds/iEbayRefunds';
import { BehaviorSubject, Observable, catchError, combineLatest, map, switchMap, tap } from 'rxjs';
import { iRefunds } from '../../model/iRefund';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HelperService } from 'src/app/helper/helper.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { iItemActions } from 'src/app/model/iItemActions';


@Injectable({
  providedIn: 'root'
})
export class RefundService {

  #api = environment.api + 'refund';
  currentRefunds: BehaviorSubject<iRefunds[]> = new BehaviorSubject<iRefunds[]>([]);
  actionSig = signal<iItemActions<any>>({ item: null, action: 'getall'});
  refunds$ = combineLatest([toObservable(this.helperService.searchSig), toObservable(this.helperService.pageNrSig), toObservable(this.helperService.artikelProSiteSig),
  toObservable(this.actionSig)]).pipe(
    switchMap(([search, pagenr, artprosite, action]) => {
      if(action.action === 'donothing')
      return this.currentRefunds.asObservable();

      if(action.action === 'delete')
      return this.deleteRefund(action.item.id);

      return this.getAllRefunds(search, pagenr, artprosite);
    })
  )

  constructor(private readonly httpClient: HttpClient, private readonly errorService: ErrorService, private snackService: MatSnackBar, private helperService: HelperService) { }

  createRefund(refundDto: iRefunds, refundOnEbay: iEbayRefunds): Observable<iRefunds[]> {
    return this.httpClient.post<iRefunds[]>(`${this.#api}`,{ refundDto, refundOnEbay } )
      .pipe(
        tap(res => {
          if (Object(res).message) {
            this.errorService.newMessage(Object(res).message);
          }

          if(res[0].id) {
            this.snackService.open('Die Zahlung wurde erfolgreich abgeschlossen', 'OK', { duration: 3000 });
        }}),
        catchError(error => {
          this.errorService.newMessage('Error creating refund');
          throw error;
        })
      );
  }

  getRefundById(id: string): Observable<iRefunds[]> {
    return this.httpClient.get<any>(`${this.#api}/${id}`)
      .pipe(
        catchError(error => {
          this.errorService.newMessage('Error getting refund by id');
          throw error;
        })
      );
  }

  getAllRefunds(search: string, pagenr: number, artprosite: number): Observable<iRefunds[]> {
    if(search.length < 1)
      search = 'null';
    return this.httpClient.get<[iRefunds[], number]>(`${this.#api}/${search}/${pagenr}/${artprosite}`)
      .pipe(
        catchError(error => {
          this.errorService.newMessage('Error getting all refunds');
          throw error;
        }),
        map((res) => {

          this.helperService.paginationCountSig.set(res[1]);
          this.currentRefunds.next(res[0]);
          return res[0];
        })
      );
  }


  deleteRefund(id: number): Observable<any> {
    return this.httpClient.delete<{raw: any, affected: number}>(`${this.#api}/${id}`)
      .pipe(
        catchError(error => {
          this.errorService.newMessage('Error deleting refund');
          throw error;
        }),
        tap((res) => {
          if(res.affected === 1) {
            const curRefunds = this.currentRefunds.value.filter((tmp) => tmp.id !== id);
            this.currentRefunds.next(curRefunds);
            this.actionSig.set({item: null, action: 'donothing'});
          }
        })
      );
  }
}
