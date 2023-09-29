import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { iEbayItem } from '../model/iEbayItem';

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
    return this.httpService.get<iEbayItem[]>(this.#api).pipe(tap((res) => {
      console.log(res)
    }));
  }
  generateFirstAccessToken(code: string) {
    return this.httpService.post(this.#api, { code: code });
  }
  getItemsFromEbay() {}
}
