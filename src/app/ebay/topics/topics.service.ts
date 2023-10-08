import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { iEbayTopic } from 'src/app/model/ebay/iEbayTopic';
import { iEbayTopicsPayload } from 'src/app/model/ebay/iEbayTopicsPayload';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TopicsService {
  #api = environment.api + 'subs';
  constructor(private readonly httpClient: HttpClient) { }
  getTopics(limit: number, link: string | null) : Observable<iEbayTopicsPayload> {
    if(!link)
      link = 'null';


   return this.httpClient.get<iEbayTopicsPayload>(`${this.#api}/topics/${limit}/${link}`).pipe(
    catchError((err) => {
      console.log(err);
      return of({} as iEbayTopicsPayload);
    }),
    tap((res) => {
      console.log(res);
    })
   )
  }
  getTopic(id: string): Observable<iEbayTopic> {
    return this.httpClient.get<iEbayTopic>(`${this.#api}/topic/${id}`).pipe(
      catchError((err) => {
        console.log(err);
        return of({} as iEbayTopic);
      }),
      tap((res) => {
        console.log(res);
      })
    );
  }
}
