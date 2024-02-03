import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, of, tap } from "rxjs";
import { ErrorService } from "src/app/error/error.service";
import { iEbaySubscriptionsPayload } from "src/app/model/ebay/iEbaySubscriptionsPayload";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root',
})
export class EbaySubscriptionsService {
  #api = environment.api + 'subs';
  constructor(private readonly httpService: HttpClient, private readonly errorService: ErrorService) { }
  getSubscriptions(limit: number, link: string | null): Observable<iEbaySubscriptionsPayload> {
    if(!link)
      link = 'null';


    return this.httpService.get<iEbaySubscriptionsPayload>(this.#api+`/subscriptions/${limit}/${link}`).pipe(
      catchError((error) => {
        this.errorService.newMessage(error.message);
        return of({} as iEbaySubscriptionsPayload);
      }),
      tap((res) => {
        if(Object(res).status === 404)
        this.errorService.newMessage(Object(res).message)
      })
    )
  }
  activateItemSoldSubscription() {
    return this.httpService.get(this.#api+'/itemsoldon', { responseType: 'text' });
  }
  getEbaynotificationPreferences() {
    return this.httpService.get(this.#api+'/noti-prefer', { responseType: 'text' });
  }
  deactivateItemSoldSubscription() {

  }

}
