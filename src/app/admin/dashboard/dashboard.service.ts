import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { HelperService } from 'src/app/helper/helper.service';
import { iEbayMonthDetails } from 'src/app/model/ebay/iEbayMothDetails';
import { iShopMonthDetails } from 'src/app/model/iShopMonthDetails';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  #api = environment.api + 'dashboard';
  ebayshopdataSig = signal([{ data: [] }]);
  ebayNettoDataSig =  signal([{ data: [] }]);
  storeNettoDataSig =  signal([{ data: [] }]);
  monthDataSig = signal({ lables: [], datasets: []});

  months = [ 'Januar', 'Februar', 'März', 'April','Mai', 'Juni', 'Juli', 'August', 'September','Oktober', 'November', 'Dezember' ];

  courrentYearSig = signal(Number(new Date(Date.now()).getFullYear().toString()));
  yearsSig = signal([new Date(Date.now()).getFullYear().toString()]);
  constructor(private readonly httpClinet: HttpClient, private helperService: HelperService) { }
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
     this.courrentYearSig.set(Number(year));
     this.monthDataSig.set(res);
    }));
  }
  getMonthDetailEbay(month: number, year: number, pagenr: number, site_quanity: number) {

    return this.httpClinet.get<iEbayMonthDetails[]>(this.#api+'/ebay-month/'+year+'/'+month+'/'+
      pagenr+'/'+site_quanity
    );
  }
  getMonthDetailShop(month: number, year: number, pagenr: number, site_quanity: number) {

    return this.httpClinet.get<iShopMonthDetails[]>(this.#api+'/shop-month/'+year+'/'+month+
      '/'+pagenr+'/'+site_quanity
    );
  }
}
