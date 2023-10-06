import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { iEbayItem } from '../model/ebay/iEbayItem';
import { iEbaySubscriptionsPayload } from '../model/ebay/iEbaySubscriptionsPayload';

@Injectable({
  providedIn: 'root'
})
export class EbayService {
  #api = environment.api + 'ebay'
  constructor(private readonly httpService: HttpClient) { }

  getLinkForUserConsent() {
    return this.httpService.get<{address: string}>(this.#api+'/consent');
  }
  getItemsSoldBeiEbay() {
    return this.httpService.get<iEbayItem>(this.#api).pipe(map((res) => {
      console.log(res.orders)
      return res;

    }));
  }

  getItemsFromEbay() {}
}
