import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { ErrorService } from 'src/app/error/error.service';
import { iEbayTransaction } from 'src/app/model/ebay/transactionsAndRefunds/iEbayTransaction';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EbayTransactionsService {
  #api =  environment.api + 'ebay-sold';
  constructor(private http: HttpClient, private errorService: ErrorService) { }

  getAllTransactions(): Observable<iEbayTransaction[]> {
    return this.http.get<iEbayTransaction[]>(this.#api);
  }

  getTransactionById(id: string): Observable<iEbayTransaction> {
    return this.http.get<iEbayTransaction>(`${this.#api}/${id}`).pipe(
      tap((res: any) => {
       if(Object(res).message) {
         this.errorService.newMessage(res.message);
       }
       return res;
      }),
      catchError((err) => {
        this.errorService.newMessage(err.message);
        return of({id: -1} as iEbayTransaction);
      })
    );
  }

  createTransaction(transaction: iEbayTransaction): Observable<iEbayTransaction> {
    return this.http.post<iEbayTransaction>(this.#api, transaction).pipe(map((res: any) => {
      if(res.message) {
        this.errorService.newMessage(res.message);
      }
      return res;
    }));
  }

  updateTransaction(id: number, transaction: iEbayTransaction): Observable<iEbayTransaction> {
    return this.http.put<iEbayTransaction>(`${this.#api}/${id}`, transaction);
  }

  deleteTransaction(id: number): Observable<any> {
    return this.http.delete<any>(`${this.#api}/${id}`);
  }
}
