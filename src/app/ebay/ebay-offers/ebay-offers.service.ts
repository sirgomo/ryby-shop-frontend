import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { iEbayOfferListingRes } from '../../model/ebay/iEbayOfferListingRes';
import { iEbayFulfillmentPolicy } from 'src/app/model/ebay/iEbayFulfillmentPolicy';
import { iEbayPaymentPolicies } from 'src/app/model/ebay/iEbayPaymentPolicies';

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
  allgetEbayFulfillmentPolicyById(id: string | undefined): Observable<{total: number, fulfillmentPolicies: iEbayFulfillmentPolicy[]}> {
    if(!id)
      return of({total: 0, fulfillmentPolicies: []});

     return this.httpClient.get<{total: number, fulfillmentPolicies: iEbayFulfillmentPolicy[]}>(`${this.API}/allfulfillment-policy/${id}`);
  }
  getPaymentPoliciesyBymarktId(id: string | undefined): Observable<{total: number, paymentPolicies: iEbayPaymentPolicies[]}> {
    if(!id)
      return of({total: 0, paymentPolicies: []});

     return this.httpClient.get<{total: number, paymentPolicies: iEbayPaymentPolicies[]}>(`${this.API}/payment-policies/${id}`);
  }
}
