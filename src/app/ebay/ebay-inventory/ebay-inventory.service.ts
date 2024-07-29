import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { EMPTY, Observable, Subscription, catchError, combineLatest, finalize, forkJoin, map, mergeMap, of, tap } from 'rxjs';
import { ErrorService } from 'src/app/error/error.service';
import { iEbayGroupItem } from 'src/app/model/ebay/item/iEbayGroupItem';
import { iEbayImportListingRes } from 'src/app/model/ebay/iEbayImportListingRes';
import { iEbayInventory } from 'src/app/model/ebay/iEbayInventory';
import { iEbayInventoryItem } from 'src/app/model/ebay/iEbayInventoryItem';
import { iProduct } from 'src/app/model/iProduct';
import { environment } from 'src/environments/environment';
import { iEbayCategorySugestion } from 'src/app/model/ebay/item/iEbayCategorySugestion';
import { iEbayAspects } from 'src/app/model/ebay/item/iEbayAspects';
import { HelperService } from 'src/app/helper/helper.service';
import { iEbayImageResponse } from 'src/app/model/ebay/item/iEbayImageResponse';

@Injectable({
  providedIn: 'root'
})
export class EbayInventoryService {
  #api = environment.api + 'ebay-inventory';
  marktidSig = signal<number | null>(null);
  constructor(private readonly httpClinet: HttpClient, private readonly errorServ: ErrorService, private helperService: HelperService) { }

  getCurrentInventory(limit: number, offset: number, getall: boolean): Observable<iEbayInventory> {
    return this.httpClinet.get<iEbayInventory>(`${this.#api}/${limit}/${offset}`).pipe(
      catchError((err) => {
        this.errorServ.newMessage(err.message);
        return of({} as iEbayInventory);
      }),
      //get 1 item from groups of items
      map((res) => {
        if(Object(res).status == 404)
        this.errorServ.newMessage(Object(res).message);

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

            const gruopSplit = item.groupIds ?  item.groupIds![0].split('/')[0] : 'null';
            if(!gruopSplit)
              return of(item);

            if(gruopSplit === 'null')
              return this.httpClinet.get<iProduct>(`${this.#api}/sku/${item.sku}`).pipe(
                map((res) => {
                  if(res.sku !== 'null') {
                    return {
                      ...item,
                      inebay: res.sku
                    }
                  }


                  return item;
                }), catchError((err) => {
                  console.log(err)
                  return of(item);
                })
            );


                return this.httpClinet.get<iProduct>(`${this.#api}/group/${item.groupIds![0]}`).pipe(
                  map((res) => {
                    if(res && res.sku !== 'null') {
                      return {
                        ...item,
                        inebay: res.sku
                      }
                    }

                    return item;
                  }), catchError((err) => {
                    console.log(err)
                    return of(item);
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
    const tmp1 : { listings: string } = { listings: listing.replace(/(\r\n\s|\n|\r|\s)/gm, '') };
    const tmp : { listings: string } = { listings: tmp1.listings.endsWith(',') ? tmp1.listings.slice(0, tmp1.listings.length -2) : tmp1.listings };
    return this.httpClinet.post<iEbayImportListingRes[]>(`${this.#api}/listing`, tmp).pipe(
      catchError((err) => {
        return [];
      })
    )
  }
  //get inventoryItemgroup with items
  getInventoryItemGroup(groupid: string): Observable<iEbayGroupItem> {
    if(groupid === undefined || groupid.split('/')[0] === 'null')
    return of({} as iEbayGroupItem);


   return this.httpClinet.get<iEbayGroupItem>(`${this.#api}/ebay/groupid/${groupid}`).pipe(
    catchError((err) => {
      return of({} as iEbayGroupItem);
    }),
    map((res) => {
      if(Object(res).errors) {
        this.errorServ.newMessage(Object(res).errors[0].message);
        return {} as iEbayGroupItem;
      }
      return res;
    })
    )
  }
    //get inventoryItem by sku
    getInventoryItemBySku(sku: string | undefined): Observable<iEbayInventoryItem> {
      if(sku === undefined)
      return of({} as iEbayInventoryItem);


     return this.httpClinet.get<iEbayInventoryItem>(`${this.#api}/ebay/sku/${sku}`).pipe(
      catchError((err) => {
        console.log(err)
        return of({} as iEbayInventoryItem);
      }))
    }
    getEbayDefaultCategoryId() {
      return this.httpClinet.get<{categoryTreeId : string, categoryTreeVersion : string}>(`${this.#api}/default-category`).pipe(map((res) => {
        return res;
      }));
    }
    getEbayCategorySugestion(marktid: number, query: string) {
      return this.httpClinet.get<iEbayCategorySugestion>(`${this.#api}/category-sugesstions?markt=${marktid}&query=${query}`);
    }
    getAspectsForCategoryId(id: number) {
        if(!this.marktidSig())
          throw new Error('Category Tree Id null !');
      
      return this.httpClinet.get<iEbayAspects>(`${this.#api}/category-aspects?tree_id=${this.marktidSig()}&category=${id}`);
    }
    saveImageOnEbayServer(image: File) {

      const formData = new FormData();
      formData.append('image', image);
      return this.httpClinet.post<iEbayImageResponse>(`${this.#api}/post-image`, formData, {
         reportProgress: true,
          observe: 'events',
         responseType: 'json',
      }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error occurred:', error);
             // Możesz zwrócić odpowiedni komunikat lub wartość domyślną
             return of({ message: error.message } as unknown as iEbayImageResponse);
           })
    );
    }
    //get image
  getImageFromEbay(url: string) {
  return this.httpClinet.post(url, { responseType: 'blob' }).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Error occurred:', error);
           // Możesz zwrócić odpowiedni komunikat lub wartość domyślną
           return of({ message: error.message } as unknown as Blob);
         })
    );
  }

}
