import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ErrorService } from '../../error/error.service';
import { iEbayRefunds } from '../../model/ebay/transactionsAndRefunds/iEbayRefunds';
import { Observable, catchError, tap } from 'rxjs';
import { iRefunds } from '../../model/iRefund';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EbayService } from '../ebay.service';
import { iEbayOrder } from '../../model/ebay/orders/iEbayOrder';
import { iEbayAllOrders } from '../../model/ebay/orders/iEbayAllOrders';
import { HelperService } from '../../helper/helper.service';

@Injectable({
  providedIn: 'root'
})
export class RefundService {

  #api = environment.api + 'refund';

  constructor(private readonly httpClient: HttpClient, private readonly errorService: ErrorService, private snackService: MatSnackBar) { }

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

  getAllRefunds(): Observable<iRefunds[]> {
    return this.httpClient.get<iRefunds[]>(`${this.#api}`)
      .pipe(
        catchError(error => {
          this.errorService.newMessage('Error getting all refunds');
          throw error;
        })
      );
  }

  updateRefund(id: number, refundDto: iRefunds): Observable<iRefunds> {
    return this.httpClient.put<iRefunds>(`${this.#api}/${id}`, refundDto)
      .pipe(
        catchError(error => {
          this.errorService.newMessage('Error updating refund');
          throw error;
        })
      );
  }

  deleteRefund(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.#api}/${id}`)
      .pipe(
        catchError(error => {
          this.errorService.newMessage('Error deleting refund');
          throw error;
        })
      );
  }
}
