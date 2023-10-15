import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs';
import { iProduktVariations } from 'src/app/model/iProduktVariations';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VariationsService {
  #api = environment.api + 'variation';


  constructor(private httpClient: HttpClient, private readonly snack: MatSnackBar) { }

  findAll() {
    return this.httpClient.get<iProduktVariations[]>(this.#api).pipe(tap((res) => {
      console.log(res)
    }));
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
