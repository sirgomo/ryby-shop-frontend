import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { iEbayOfferListingRes } from '../model/ebay/iEbayOfferListingRes';

@Injectable({
  providedIn: 'root'
})
export class EbayOffersService {

  API = environment.api + 'ebay-offers';
  constructor(private readonly httpClient: HttpClient) { }

  getOffersBeiSku(sku: string | undefined): Observable<iEbayOfferListingRes> {
    if(!sku)
      return of({} as iEbayOfferListingRes);

   return this.httpClient.get<iEbayOfferListingRes>(`${this.API}/${sku}`);
  }
}
