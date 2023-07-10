import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, shareReplay, switchMap, tap } from 'rxjs';
import { ErrorService } from 'src/app/error/error.service';
import { iLieferant } from 'src/app/model/iLieferant';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LiferantsService {
   api = environment.api +  'liferant';
  trytoGetData = false;
  #liferants : BehaviorSubject<iLieferant[]> =  new BehaviorSubject<iLieferant[]>([]);
  liferants$ = this.#liferants.asObservable().pipe(switchMap((res) => {
    if(res.length < 1 && !this.trytoGetData) {
      this.trytoGetData = true;
      return this.getAllLieferanten();
    }


      return of(res);
  }));

  constructor(private http: HttpClient, private error: ErrorService) {}

  getAllLieferanten(): Observable<iLieferant[]> {
    return this.http.get<iLieferant[]>(this.api).pipe(map(res => {
      this.trytoGetData = false;

     this.#liferants.next(res);
     return res;
    }),
    catchError((err) => {
      this.trytoGetData = false;
      this.error.newMessage(err.message)
      return of([] as iLieferant[]);
    })
    );
  }

  getLieferantById(id: number): Observable<iLieferant> {
    return this.http.get<iLieferant>(`${this.api}/${id}`);
  }

  createLieferant(lieferant: iLieferant): Observable<iLieferant> {
    return this.http.post<iLieferant>(this.api, lieferant).pipe(map((res) => {
      const curr = this.#liferants.value;
      const newT = curr.slice(0);
      newT.push(res);
      this.#liferants.next(newT);
      return res;
    }),
    catchError((err) => {
      this.error.newMessage(err.message)
      return of({} as iLieferant);
    }));
  }

  updateLieferant(lieferant: iLieferant): Observable<iLieferant> {
    return this.http.put<iLieferant>(this.api, lieferant).pipe(map((res) => {
      const items = this.#liferants.value;
      const index = items.findIndex((item) => item.id === lieferant.id);
      const newItems = items.slice(0);
      newItems[index] = res;
      this.#liferants.next(newItems);
      return res;
    }),
    catchError((err) => {
      this.error.newMessage(err.message)
      return of({} as iLieferant);
    }));
  }

  deleteLieferant(id: number): Observable<number> {
    return this.http.delete<number>(`${this.api}/${id}`).pipe(tap((res) => {
      if(res === 1) {
        const newT = this.#liferants.value.filter((item) => item.id !== id);
        this.#liferants.next(newT);

      }
      return this.#liferants.value;
    }),
    catchError((err) => {
      this.error.newMessage(err.message)
      return of(0);
    }));
  }
}
