import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, catchError, map, of, switchMap } from 'rxjs';
import { ErrorService } from 'src/app/error/error.service';
import { iKategorie } from 'src/app/model/iKategorie';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KategorieService {
  trytoGetData = false;
  #kategorie : BehaviorSubject<iKategorie[]> =  new BehaviorSubject<iKategorie[]>([]);
  kategorie$ = this.#kategorie.asObservable().pipe(switchMap(res => {
    if(res === null || res === undefined)
      return [];

      if(res.length < 1 && !this.trytoGetData) {
        this.trytoGetData = true;
        return this.getAllCategories();
      }
      return of(res);
  }));

  private apiUrl = environment.api + 'kategorie';

  constructor(private http: HttpClient, private readonly errService: ErrorService, private snackBar: MatSnackBar) { }

  createCategory(categoryData: Partial<iKategorie>): Observable<iKategorie[]> {

  return this.http.post<iKategorie>(this.apiUrl, categoryData).pipe(map((res) => {
    if(!isFinite(res.id)) {
      this.errService.newMessage(Object(res).message)
      return this.#kategorie.value;
    }

      this.snackBar.open('Kategorie erstellt', 'ok', { duration: 1000 })
      const curr = this.#kategorie.value;
      curr.push(res);
      const newCat = curr.splice(0);
      this.#kategorie.next(newCat);
      return newCat;
  }),
  catchError((err) => {
    console.log(err)
    this.errService.newMessage(err.message)
    return of(this.#kategorie.value);
  })
  );

  }

  getCategoryById(id: number): Observable<iKategorie | undefined> {
    return this.http.get<iKategorie>(`${this.apiUrl}/${id}`);
  }

  getAllCategories(): Observable<iKategorie[]> {
    return this.http.get<iKategorie[]>(this.apiUrl).pipe(map((res) => {
      if(!res.length) {
        this.errService.newMessage('Es gibt ein error aufgetreten');
        this.#kategorie.next([]);
        return [];
      }
      this.#kategorie.next(res);
      this.trytoGetData = false;
      return res;
    }),
   catchError((err) => {
    console.log(err)
    this.errService.newMessage('Es gibt ein error aufgetreten');
    this.#kategorie.next([]);
    return [];
   })
    );
  }

  updateCategory(id: number, categoryData: Partial<iKategorie>): Observable<iKategorie[]> {
    return this.http.put<iKategorie>(`${this.apiUrl}/${id}`, categoryData).pipe(map((res) => {
      if (res.id === id) {
        const kat = this.#kategorie.value;
        const index = kat.findIndex((item) => item.id === id);
        const newKat = kat.slice(0);
        newKat[index] = res;
        this.#kategorie.next(newKat);
        this.snackBar.open('Kategorie wurde geändert', 'ok', { duration: 1000 })
      }
      return this.#kategorie.value;
    }),
      catchError((err) => {

        this.errService.newMessage(err.message);
        return this.#kategorie.value;
      })
    ) as Observable<iKategorie[]>;
  }

  deleteCategory(id: number): Observable<iKategorie[]> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`).pipe(map((res) => {
      if(res === true) {
        const tmp = this.#kategorie.value;
        const tmpNew = tmp.filter((item) => item.id !== id);
        this.#kategorie.next(tmpNew);
        this.snackBar.open('Kategorie wurde gelöscht', 'ok', {duration: 1000 });
      }


      return this.#kategorie.value;
    }),
    catchError((err) => {
      this.errService.newMessage(err.message);
      return of(this.#kategorie.value);
    })
    );
  }

  addProductToCategory(categoryId: number, productId: number): Observable<iKategorie | undefined> {
    return this.http.post<iKategorie>(`${this.apiUrl}/${categoryId}/products/${productId}`, {});
  }

  removeProductFromCategory(categoryId: number, productId: number): Observable<iKategorie | undefined> {
    return this.http.delete<iKategorie>(`${this.apiUrl}/${categoryId}/products/${productId}`);
  }
  getKategorieWithArtikles(): Observable<iKategorie[]> {
    return this.http.get<iKategorie[]>(this.apiUrl+'/products');
  }
}
