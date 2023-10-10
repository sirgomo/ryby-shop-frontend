import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { iEbayImportListingRes } from 'src/app/model/ebay/iEbayImportListingRes';
import { iEbayInventory } from 'src/app/model/ebay/iEbayInventory';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EbayInventoryService {

  #api = environment.api + 'ebay-inventory';
  constructor(private readonly httpClinet: HttpClient) { }

  getCurrentInventory(limit: number, offset: number): Observable<iEbayInventory> {
    return this.httpClinet.get<iEbayInventory>(`${this.#api}/${limit}/${offset}`).pipe(
      catchError((err) => {
        console.log(err);
        return of({} as iEbayInventory);
      }),
      tap(res => {
        console.log(res);
      })
    );
  }
  postListingsString(listing: string): Observable<iEbayImportListingRes[]> {
    const tmp : { listings: string } = { listings: listing.replace(/(\r\n\s|\n|\r|\s)/gm, '') };
    return this.httpClinet.post<iEbayImportListingRes[]>(`${this.#api}/listing`, tmp).pipe(
      catchError((err) => {
        console.log(err);
        return [];
      }),
      tap(res => {
        console.log(res)
      })
    )
  }
}
