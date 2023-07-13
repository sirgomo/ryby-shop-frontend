import { HttpClient } from '@angular/common/http';
import { Injectable, computed } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, of, tap, throwError } from 'rxjs';
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
  productsGetSig = toSignal<iProduct[], iProduct[]>(this.getAllProducts(this.helper.searchSig(), this.helper.kategorySig()?.id, this.helper.artikelProSiteSig()), { initialValue: []});
  productsSig = computed (() => (this.productsGetSig()))

  constructor(private readonly httpClinet: HttpClient, private readonly error: ErrorService, private readonly snackbar: MatSnackBar,
    private readonly helper: HelperService) { }

  createProduct(product: iProduct) {
    return this.httpClinet.post<iProduct>(`${this.API}`, product).pipe(
      catchError((error) => {
        this.error.newMessage('Failed to create product.');
        return throwError(() => error);
      })
    );
  }

  updateProduct(id: number, product: iProduct) {
    return this.httpClinet.put<iProduct>(`${this.API}/${id}`, product).pipe(
      catchError((error) => {
        this.error.newMessage('Failed to update product.');
        return throwError(()=> error);
      })
    );
  }

  deleteProduct(id: number) {
    return this.httpClinet.delete(`${this.API}/${id}`).pipe(
      catchError((error) => {
        this.error.newMessage('Failed to delete product.');
        return throwError(()=> error);
      })
    );
  }

  getAllProducts(search: string | undefined, id: number | undefined, items: number) {
    return this.httpClinet.get<iProduct[]>(`${this.API}`).pipe(
      catchError((error) => {
        this.error.newMessage('Failed to get all products.');
        return throwError(()=> error);
      }),
      tap((res) => {
        console.log(res)
      })
    );
  }

  getProductById(id: number) {
    return this.httpClinet.get<iProduct>(`${this.API}/${id}`).pipe(
      catchError((error) => {
        this.error.newMessage('Failed to get product by id.');
        return throwError(()=> error);
      })
    );
  }

  uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('photo', file);

    return this.httpClinet.post<string>(`${this.API}/upload`, formData).pipe(
      catchError((error) => {
        this.error.newMessage('Failed to upload photo.');
        return throwError(()=> error);
      })
    );
  }
}
