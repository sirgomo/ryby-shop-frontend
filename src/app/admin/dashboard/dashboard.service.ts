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
  selectedYearSig = signal('');
  
  yearsSig = signal([new Date(Date.now()).getFullYear().toString()]);
  constructor(private readonly httpClinet: HttpClient) { }
  getJahres() {
    if(this.selectedYearSig().length < 4)
        this.selectedYearSig.set(this.yearsSig()[0]);

    this.yearsSig.set([this.yearsSig()[0], '2023']);
      return of(['2024', '2023']);
  }
  getEbayShopData(year?: string) {
    if(!year)
      year = new Date(Date.now()).getFullYear().toString();

    return this.httpClinet.get<[{ data: [] }]>(this.#api + '/eals/'+year).pipe(tap((res) => {
      this.ebayshopdataSig.set(res);
    })); 
  }
  getEbayNettoData() {
    return of([{ data: [500, 50, 50 ]}]);
  }
  getStoreNettoData() {
    return of([{ data: [500, 50, 20 ]}]);
  }
  getMonthData() {
    return of({
      labels: [ '2006', '2007', '2008', '2009', '2010', '2011', '2012' ],
      datasets: [
        { data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'Ebay' },
        { data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Shop' }
      ]
    });
  }
}
