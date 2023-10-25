import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMPTY, Subject, catchError, combineLatest, finalize, map, of, switchMap, takeUntil, tap, throwError } from 'rxjs';
import { ErrorService } from 'src/app/error/error.service';
import { iProduct } from 'src/app/model/iProduct';
import { toObservable, toSignal } from '@angular/core/rxjs-interop'
import { environment } from 'src/environments/environment';
import { HelperService } from 'src/app/helper/helper.service';
import { iDelete } from 'src/app/model/iDelete';
import { AuthService } from 'src/app/auth/auth.service';




@Injectable({
  providedIn: 'root'
})
export class ProductService {
  API = environment.api + 'product';

  item  = signal<iProduct>({} as iProduct);
  items$ = combineLatest([toObservable(this.helper.searchSig), toObservable(this.helper.kategorySig), toObservable(this.helper.artikelProSiteSig), toObservable(this.helper.pageNrSig)]).pipe(
    switchMap(([search, kat, artpro, pagenr]) => this.getAllProducts(search, kat.id, artpro, pagenr)),
    map((res) => {
      return res;
    })
  );

  productsGetSig = toSignal<iProduct[], iProduct[]>(this.items$, { initialValue:  []});

  productsSig = computed (() => {
  const items = this.productsGetSig();
    if(this.item().id) {
      if( this.item().id! < 0) {
        const id = Math.abs(this.item().id!);
        const index = items.findIndex((item) => item.id === id);
        items.splice(index, 1);
        const nit = items.slice(0);
        return nit;
      }

      const index = items.findIndex((item) => item.id === this.item().id)
      if(index === -1) {
        const nit = items.slice(0);
        nit.push(this.item());

        return nit;
      }
      const nit = items.slice(0);
      nit[index] = this.item();
      return nit;
    }

    return items;
  })



  constructor(private readonly http: HttpClient, private readonly error: ErrorService, private readonly snackbar: MatSnackBar,
    private readonly helper: HelperService, private readonly authServ: AuthService) {}

  createProduct(product: iProduct) {
    return this.http.post<iProduct>(`${this.API}`, product).pipe(
      catchError((error) => {
        this.error.newMessage('Fehler beim Erstellen des Produkts.');
        return throwError(() => error);
      }),
      map((res) => {
        if(res && res.id)
          this.item.set(res);
        return res;
      })
    );
  }

  updateProduct(id: number, product: iProduct) {
    return this.http.put<iProduct>(`${this.API}/${id}`, product).pipe(
      catchError((error) => {
        this.error.newMessage('Fehler beim Aktualisieren des Produkts.');
        return throwError(()=> error);
      }),
      tap((res) => {
        this.item.set(res);
      })
    );
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.API}/${id}`).pipe(
      catchError((error) => {
        this.error.newMessage('Fehler beim Löschen des Produkts.');
        return throwError(()=> error);
      }),
      tap((res) => {
        if(Object(res).affected === 1) {
          this.snackbar.open('Produkt wurde gelöscht', '', { duration: 2000 });
          const item = { id : -id } as iProduct;
          this.item.set(item);
        } else {

          this.error.newMessage(Object(res).message);
        }
      })
    );
  }

  getAllProducts(search: string, katid: number, itemscount: number, pagenr: number) {
    if(katid === undefined)
      katid = 0;
    if(search.length < 1)
    search = 'null';
    this.authServ.isTokenExpired();
    const role = localStorage.getItem('role')

    if( role && role === 'ADMIN') {
      return this.http.get<iProduct[]>(`${this.API}/${search}/${katid}/${itemscount}/${pagenr}`).pipe(
        catchError((error) => {
          this.error.newMessage('Fehler beim Abrufen aller Produkte.');
          return [];
        }),
        tap((res) => {
          return res;
        })
      );
    }

    return this.http.get<iProduct[]>(`${this.API}/kunde/${search}/${katid}/${itemscount}/${pagenr}`).pipe(
      catchError((error) => {
        this.error.newMessage('Fehler beim Abrufen aller Produkte.');
        return [];
      }),
      tap((res) => {
        return res;
      })
    );
  }

  getProductById(id: number) {
    return this.http.get<iProduct>(`${this.API}/${id}`).pipe(
      map(res => {
        return res;
      }),
      catchError((error) => {
        this.error.newMessage('Fehler beim Abrufen des Produkts nach der ID.' + error.message);
        return of({} as iProduct);
      })
    );
  }

  deleteEanById(id: number) {
    return this.http.delete(`${this.API}/ean/`+id).pipe(map((res) => {
      return res;
    }),
    catchError((err) => {
      this.error.newMessage(err.message);
      return throwError(()=> err);
    }))
  }
}
