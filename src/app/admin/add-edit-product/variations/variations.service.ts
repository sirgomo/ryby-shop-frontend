import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, combineLatest, map, of, startWith } from 'rxjs';
import { iProduktVariations } from 'src/app/model/iProduktVariations';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VariationsService {
  #api = environment.api + 'variation';

  variations : BehaviorSubject<iProduktVariations[] | null> = new BehaviorSubject<iProduktVariations[] | null>(null);
  variations$ = combineLatest([this.variations.asObservable(), this.findAll()]).pipe(map(([vari, find]) => {
    if(vari === null)
      return find;

      return vari;
  }))

  constructor(private httpClient: HttpClient, private readonly snack: MatSnackBar) { }

  findAll(): Observable<iProduktVariations[]> {
    return this.httpClient.get<iProduktVariations[]>(this.#api).pipe(
      map((res) => {
      console.log(res)

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
    return this.httpClient.post<iProduktVariations>(this.#api, produktVariations);
  }

  delete(sku: string) {
    return this.httpClient.delete<iProduktVariations>(`${this.#api}/${sku}`);
  }

  update(sku: string, produktVariations: Partial<iProduktVariations>) {
    return this.httpClient.put<iProduktVariations>(`${this.#api}/${sku}`, produktVariations);
  }
}
