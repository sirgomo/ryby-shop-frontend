import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { iEbayAllOrders } from '../model/ebay/orders/iEbayAllOrders';

@Injectable({
  providedIn: 'root'
})
export class EbayService {
  #api = environment.api + 'ebay'
  constructor(private readonly httpService: HttpClient) { }

  getLinkForUserConsent() {
    return this.httpService.get<{address: string}>(this.#api+'/consent');
  }
  getItemsSoldBeiEbay(): Observable<iEbayAllOrders> {
    return this.httpService.get<iEbayAllOrders>(this.#api).pipe(map((res) => {
     console.log(res);
      return res;
    }));
  }

  getItemsFromEbay() {}
}
