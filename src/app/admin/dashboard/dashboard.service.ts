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
    //return of([{ data: [500, 50, 50 ]}]);
    return this.httpClinet.get<[{data: []}]>(this.#api+'/ebay-netto/'+year).pipe(tap(res => {
      console.log(res);
      this.ebayNettoDataSig.set(res);
    }));
  }
  getStoreNettoData() {
    return of([{ data: [500, 50, 20 ]}]);
  }
  getMonthData() {
    return of({
      labels: [ 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember' ],
      datasets: [
        { data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'Ebay' },
        { data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Shop' }
      ]
    });
  }
}
