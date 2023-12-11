import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, catchError, combineLatest, map, of, switchMap, tap } from 'rxjs';
import { ErrorService } from 'src/app/error/error.service';
import { HelperService } from 'src/app/helper/helper.service';
import { iProduktRueckgabe } from 'src/app/model/iProduktRueckgabe';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderRefundsService {
  #api = environment.api + 'shop-refund';
  refunds: BehaviorSubject<iProduktRueckgabe[]> = new BehaviorSubject<iProduktRueckgabe[]>([]);
  refunds$ = combineLatest([toObservable(this.helperService.artikelProSiteSig), toObservable(this.helperService.pageNrSig), this.refunds.asObservable()]).pipe(
    switchMap(([count, sitenr, local]) => this.getAllShopRefunds(count, sitenr)),
    map((res) => {
      return res;
    })
  )

  constructor(private readonly httpClient: HttpClient, private readonly errorService: ErrorService, private helperService: HelperService) { }
  createRefund(refund: iProduktRueckgabe): Observable<iProduktRueckgabe> {
    return this.httpClient.post<iProduktRueckgabe>(`${this.#api}`, refund).pipe(
      tap((res) => {
        if(res.id === -1) {
          this.errorService.newMessage('Etwas ist schiefgelaufen, Produkt refund wurde nicht gespeichert');
          console.log(res)
        }
      }),
      catchError((err) => {
        console.log(err);
       this.errorService.newMessage(err.message);
        return of({id: -1} as iProduktRueckgabe);
      })
    )
  }
  getRefundById(id: number) {}
  getAllShopRefunds(count: number, sitenr: number): Observable<iProduktRueckgabe[]> {


    return this.httpClient.get<[iProduktRueckgabe[], number]>(`${this.#api}/${count}/${sitenr}`).pipe(
      map((res) => {
        this.helperService.paginationCountSig.set(res[1]);
        console.log(res);
        return res[0];
      }),
      catchError((err) => {
        this.errorService.newMessage(err.message);
        return [];
      })
    );
  };
  deleteRefundById(id: number) {}
}
