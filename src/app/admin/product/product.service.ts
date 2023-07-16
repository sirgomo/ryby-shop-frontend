import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable, Signal, computed, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMPTY, Subject, catchError, finalize, map, takeUntil, tap, throwError } from 'rxjs';
import { ErrorService } from 'src/app/error/error.service';
import { iProduct } from 'src/app/model/iProduct';
import { toSignal } from '@angular/core/rxjs-interop'
import { environment } from 'src/environments/environment';
import { HelperService } from 'src/app/helper/helper.service';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  API = environment.api + 'product';
  item  = signal<iProduct>({} as iProduct);
  productsGetSig = toSignal<iProduct[], iProduct[]>(this.getAllProducts(this.helper.searchSig(), this.helper.kategorySig()?.id, this.helper.artikelProSiteSig()), { initialValue: []});
  productsSig = computed (() => {
    const items = this.productsGetSig();
    if(this.item().id) {
      const nit = items.slice(0);
      nit.push(this.item());
      return nit;
    }

    return items;
  })
  break: Subject<any> = new Subject();


  constructor(private readonly http: HttpClient, private readonly error: ErrorService, private readonly snackbar: MatSnackBar,
    private readonly helper: HelperService) { }

  createProduct(product: iProduct) {
    console.log(product)
    return this.http.post<iProduct>(`${this.API}`, product).pipe(
      catchError((error) => {
        this.error.newMessage('Fehler beim Erstellen des Produkts.');
        return throwError(() => error);
      }),
      tap((res) => {
        if(res && res.id)
          this.item.set(res);
      })
    );
  }

  updateProduct(id: number, product: iProduct) {
    return this.http.put<iProduct>(`${this.API}/${id}`, product).pipe(
      catchError((error) => {
        this.error.newMessage('Fehler beim Aktualisieren des Produkts.');
        return throwError(()=> error);
      })
    );
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.API}/${id}`).pipe(
      catchError((error) => {
        this.error.newMessage('Fehler beim Löschen des Produkts.');
        return throwError(()=> error);
      })
    );
  }

  getAllProducts(search: string | undefined, id: number | undefined, items: number) {
    return this.http.get<iProduct[]>(`${this.API}`).pipe(
      catchError((error) => {
        this.error.newMessage('Fehler beim Abrufen aller Produkte.');
        return throwError(()=> error);
      }),
      tap((res) => {
        console.log(res)
      })
    );
  }

  getProductById(id: number) {
    return this.http.get<iProduct>(`${this.API}/${id}`).pipe(
      catchError((error) => {
        this.error.newMessage('Fehler beim Abrufen des Produkts nach der ID.');
        return throwError(()=> error);
      })
    );
  }
  // upload image
  uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('photo', file);

    return this.http.post(`${this.API}/upload`, formData, { reportProgress: true, observe: 'events' }).pipe(
      catchError((error) => {
        this.error.newMessage('Fehler beim Hochladen des Fotos.');
        return throwError(()=> error);
      }),
      finalize(() => this.resetFotoUpload()),
      tap((event) => {
        if(event.type == HttpEventType.UploadProgress && event.total) {
           this.helper.uploadProgersSig.set(Math.round(100 * (event.loaded / event.total)));

        }
      }),
      map(res => {
        if(res.type == HttpEventType.Response)
          return res.body

          return null;
      })
      ,takeUntil(this.break.asObservable())
    );
  }
  //reset upload and break
  resetFotoUpload() {
    this.helper.uploadProgersSig.set(0);
    this.break.next(EMPTY);
  }
  //get image
  getImage(id: string) {
    console.log('getImage ' +id)
    return this.http.get(`${this.API}/uploads/${id}`, { responseType: 'blob' }).pipe(
      catchError((err) => {
        this.error.newMessage(err.message);
        return throwError(()=> err);
      }),
      map((res) => {
        return res;
      } ));
  }
  //get thumbnails
  getThumbnails(id: string) {
    console.log('getImage ' +id)
    return this.http.get(`${this.API}/thumbnails/${id}`, { responseType: 'blob' }).pipe(
      catchError((err) => {
        this.error.newMessage(err.message);
        return throwError(()=> err);
      }),
      map((res) => {
        return res;
      } ));
  }
}
