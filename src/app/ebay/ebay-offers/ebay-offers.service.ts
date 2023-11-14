import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { iEbayOfferListingRes } from '../../model/ebay/iEbayOfferListingRes';
import { iEbayFulfillmentPolicy } from 'src/app/model/ebay/iEbayFulfillmentPolicy';

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
  getEbayFulfillmentPolicyById(id: string | undefined): Observable<iEbayFulfillmentPolicy> {
    if(!id)
      return of({} as iEbayFulfillmentPolicy);

     return this.httpClient.get<iEbayFulfillmentPolicy>(`${this.API}/fulfillment-policy/${id}`);
  }
}
