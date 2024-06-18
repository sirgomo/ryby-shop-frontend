import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  #api = environment.api + 'dashboard';
  ebayshopdataSig = signal([{ data: [] }]);
  ebayNettoDataSig =  signal([{ data: [] }]);
  storeNettoDataSig =  signal([{ data: [] }]);
  monthDataSig = signal({ lables: [], datasets: []})

  
  yearsSig = signal([new Date(Date.now()).getFullYear().toString()]);
  constructor(private readonly httpClinet: HttpClient) { }
  getJahres() {
    return this.httpClinet.get<{years: string}[]>(this.#api+'/years').pipe(tap(res => {

      if(res && res.length > 0) {
       const years: string[] = [];
       res.forEach((item) => {
        years.push(item.years)
       })
       this.yearsSig.set(years);
      }
    }))
  }
  getEbayShopData(year?: string) {
    if(!year)
      year = new Date(Date.now()).getFullYear().toString();

    return this.httpClinet.get<[{ data: [] }]>(this.#api + '/eals/'+year).pipe(tap((res) => {
      this.ebayshopdataSig.set(res);
    })); 
  }
  getEbayNettoData(year?: string) {
    if(!year)
      year = new Date(Date.now()).getFullYear().toString();

    return this.httpClinet.get<[{data: []}]>(this.#api+'/ebay-netto/'+year).pipe(tap(res => {
      this.ebayNettoDataSig.set(res);
    }));
  }
  getStoreNettoData(year?: string) {
     if(!year)
      year = new Date(Date.now()).getFullYear().toString();

    return this.httpClinet.get<[{data: []}]>(this.#api+'/shop-netto/'+year).pipe(tap(res => {
      this.storeNettoDataSig.set(res);
    }));
  }
  getMonthData(year?: string) {
    if(!year)
      year = new Date(Date.now()).getFullYear().toString();

    return this.httpClinet.get<{lables: [], datasets: []}>(this.#api+'/months/'+year).pipe(tap(res => {
     this.monthDataSig.set(res);
    }));

  }
}
