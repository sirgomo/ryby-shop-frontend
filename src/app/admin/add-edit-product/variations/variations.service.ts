import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, catchError, combineLatest, map, tap } from 'rxjs';
import { ErrorService } from 'src/app/error/error.service';
import { iProduktVariations } from 'src/app/model/iProduktVariations';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VariationsService {
  #api = environment.api + 'variation';

  variations : BehaviorSubject<iProduktVariations[]> = new BehaviorSubject<iProduktVariations[]>([]);

  variations$ = combineLatest([this.findAllforSelect()]).pipe(map(([find]) => {
      return find;
  }));


  constructor(private httpClient: HttpClient, private readonly snack: MatSnackBar, private readonly errorService: ErrorService) { }

  findAllforSelect(): Observable<iProduktVariations[]> {
    return this.httpClient.get<iProduktVariations[]>(this.#api).pipe(
      map((res) => {

      if(!res || res.length === undefined)
      return [];

        return res;
    })
    );
  }

  findByVariationsName(variations_name: string) {
    return this.httpClient.get<iProduktVariations[]>(`${this.#api}/${variations_name}`);
  }

  findOne(sku: string) {
    return this.httpClient.get<iProduktVariations>(`${this.#api}/${sku}`);
  }

  create(produktVariations: iProduktVariations) {
    return this.httpClient.post<iProduktVariations>(this.#api, produktVariations).pipe(
      tap((res) => {
        console.log(res);
        const items = this.variations.value;
        const tmp = items.slice(0);
        tmp.push(res);
        this.variations.next(tmp);
        this.snack.open('Variation wurde hinzugefugt', 'Ok', { duration: 1000 });
      }),
      catchError((err) => {
        this.errorService.newMessage('Etwas ist schiefgelaufen, Variation wurde nicht hinzugefugt!');
        return err;
      })
    );
  }

  delete(sku: string) {
    return this.httpClient.delete<iProduktVariations>(`${this.#api}/${sku}`);
  }

  update(sku: string, produktVariations: Partial<iProduktVariations>) {
    return this.httpClient.put<iProduktVariations>(`${this.#api}/${sku}`, produktVariations);
  }
}
