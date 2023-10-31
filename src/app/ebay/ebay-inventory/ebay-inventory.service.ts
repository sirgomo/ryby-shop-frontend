import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, combineLatest, forkJoin, map, mergeMap, of, tap } from 'rxjs';
import { ErrorService } from 'src/app/error/error.service';
import { iEbayImportListingRes } from 'src/app/model/ebay/iEbayImportListingRes';
import { iEbayInventory } from 'src/app/model/ebay/iEbayInventory';
import { iEbayInventoryItem } from 'src/app/model/ebay/iEbayInventoryItem';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EbayInventoryService {

  #api = environment.api + 'ebay-inventory';
  constructor(private readonly httpClinet: HttpClient, private readonly errorServ: ErrorService) { }

  getCurrentInventory(limit: number, offset: number, getall: boolean): Observable<iEbayInventory> {
    return this.httpClinet.get<iEbayInventory>(`${this.#api}/${limit}/${offset}`).pipe(
      catchError((err) => {
        console.log(err);
        this.errorServ.newMessage(err);
        return of({} as iEbayInventory);
      }),
      //get 1 item from group of items
      map((res) => {
        if(getall && res.inventoryItems) {
          let list: iEbayInventoryItem[] = []
          for (let i = 0; i < res.inventoryItems.length; i++) {
                if(res.inventoryItems[i].groupIds === undefined) {
                  res.inventoryItems[i] = {
                    ...res.inventoryItems[i],
                    groupIds : ['null/'+i]
                  }
                }

                const index = list.findIndex(item => item.groupIds![0] === res.inventoryItems[i].groupIds![0]);
                if(index === -1)
                  list.push(res.inventoryItems[i]);
          }
          res.inventoryItems = list;
        }
        return res;
      }),
      //merge it with data from shop, look if the item is in the store
      mergeMap(
        res => {

          if(!res.inventoryItems)
            return of(res);

          const items$ = forkJoin(res.inventoryItems.map((item) => {
            const gruopSplit = item.groupIds![0].split('/')[0];


            if(gruopSplit === 'null')
              return this.httpClinet.get(`${this.#api}/sku/${item.sku}`).pipe(
                map((res) => {
                  if(res.toString().length > 2)
                  return {
                    ...item,
                    inebay: res.toString()
                  }

                  return item;
                })
            );

              return this.httpClinet.get(`${this.#api}/group/${item.groupIds![0]}`).pipe(
                map((res) => {
                  if(res.toString().length > 2)
                  return {
                    ...item,
                    inebay: res.toString()
                  }

                  return item;
                })
            );
          }))
          //return the result
          return combineLatest([of(res), items$]).pipe(map(([res, itemy]) => {
            res.inventoryItems = itemy;
            return res;
          }))
        }
      )
    );
  }
  //listing with comma separated
  postListingsString(listing: string): Observable<iEbayImportListingRes[]> {
    const tmp : { listings: string } = { listings: listing.replace(/(\r\n\s|\n|\r|\s)/gm, '') };
    return this.httpClinet.post<iEbayImportListingRes[]>(`${this.#api}/listing`, tmp).pipe(
      catchError((err) => {
        return [];
      }),
      tap(res => {
        if(res.length === undefined) {
          this.errorServ.newMessage(JSON.stringify(res));
        }

      })
    )
  }
  //get inventoryItemgroup with items
  getInventoryItemGroup(groupid: string) {
    if(groupid === undefined)
    return of({});


   return this.httpClinet.get(`${this.#api}/ebay/groupid/${groupid}`).pipe(tap(res => {
    console.log(res);
   }))
  }
}
