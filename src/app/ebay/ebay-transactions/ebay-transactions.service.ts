import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { iEbayTransaction } from 'src/app/model/ebay/transactionsAndRefunds/iEbayTransaction';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EbayTransactionsService {
  #api =  environment.api + 'ebay-sold';
  constructor(private http: HttpClient) { }

  getAllTransactions(): Observable<iEbayTransaction[]> {
    return this.http.get<iEbayTransaction[]>(this.#api);
  }

  getTransactionById(id: string): Observable<iEbayTransaction> {
    return this.http.get<iEbayTransaction>(`${this.#api}/${id}`);
  }

  createTransaction(transaction: iEbayTransaction): Observable<iEbayTransaction> {
    return this.http.post<iEbayTransaction>(this.#api, transaction);
  }

  updateTransaction(id: number, transaction: iEbayTransaction): Observable<iEbayTransaction> {
    return this.http.put<iEbayTransaction>(`${this.#api}/${id}`, transaction);
  }

  deleteTransaction(id: number): Observable<any> {
    return this.http.delete<any>(`${this.#api}/${id}`);
  }
}
