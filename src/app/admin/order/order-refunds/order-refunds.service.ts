import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { ErrorService } from 'src/app/error/error.service';
import { iProduktRueckgabe } from 'src/app/model/iProduktRueckgabe';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderRefundsService {
  #api = environment.api + 'shop-refund';
  constructor(private readonly httpClient: HttpClient, private readonly errorService: ErrorService) { }
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
}
