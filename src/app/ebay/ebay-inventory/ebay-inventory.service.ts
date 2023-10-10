import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { iEbayImportListingRes } from 'src/app/model/ebay/iEbayImportListingRes';
import { iEbayInventory } from 'src/app/model/ebay/iEbayInventory';
import { iEbayInventoryItem } from 'src/app/model/ebay/iEbayInventoryItem';
import { ItemComponent } from 'src/app/products/item/item.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EbayInventoryService {

  #api = environment.api + 'ebay-inventory';
  constructor(private readonly httpClinet: HttpClient) { }

  getCurrentInventory(limit: number, offset: number, getall: boolean): Observable<iEbayInventory> {
    return this.httpClinet.get<iEbayInventory>(`${this.#api}/${limit}/${offset}`).pipe(
      catchError((err) => {
        console.log(err);
        return of({} as iEbayInventory);
      }),
      map((res) => {
        if(getall) {
          let list: iEbayInventoryItem[] = []
          for (let i = 0; i < res.inventoryItems.length; i++) {
                if(res.inventoryItems[i].groupIds === undefined) {
                  res.inventoryItems[i] = {
                    ...res.inventoryItems[i],
                    groupIds : ['null'+i]
                  }
                }

                const index = list.findIndex(item => item.groupIds![0] === res.inventoryItems[i].groupIds![0]);
                if(index === -1)
                  list.push(res.inventoryItems[i]);
          }
          res.inventoryItems = list;
        }
        return res;
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
