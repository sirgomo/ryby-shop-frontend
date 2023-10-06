import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, of, tap } from "rxjs";
import { iEbaySubscriptionsPayload } from "src/app/model/ebay/iEbaySubscriptionsPayload";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root',
})
export class EbaySubscriptionsService {
  #api = environment.api + 'subs';
  constructor(private readonly httpService: HttpClient) { }
  getSubscriptions(limit: number, link: string | null): Observable<iEbaySubscriptionsPayload> {
    if(!link)
      link = 'null';

    return this.httpService.get<iEbaySubscriptionsPayload>(this.#api+`/subscriptions/${limit}/${link}`).pipe(
      catchError((error) => {
        console.log(error);
        return of({} as iEbaySubscriptionsPayload);
      }),
      tap((res) => {
        console.log(res)
      })
    )
  }
}
