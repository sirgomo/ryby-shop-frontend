import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, EMPTY, Observable, Subject, catchError, combineLatest, finalize, map, takeUntil, tap, throwError } from 'rxjs';
import { ErrorService } from 'src/app/error/error.service';
import { HelperService } from 'src/app/helper/helper.service';
import { iDelete } from 'src/app/model/iDelete';
import { iProduktVariations } from 'src/app/model/iProduktVariations';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class VariationsService {
  #api = environment.api + 'variation';
  break: Subject<any> = new Subject();

  variations : BehaviorSubject<iProduktVariations[]> = new BehaviorSubject<iProduktVariations[]>([]);
  images = signal<string[]>([]);

  variations$ = combineLatest([this.findAllforSelect()]).pipe(map(([find]) => {
      return find;
  }));


  constructor(private httpClient: HttpClient, private readonly snack: MatSnackBar, private readonly errorService: ErrorService,
    private readonly helper: HelperService) { }

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
    return this.httpClient.delete<{raw: any, affected: number}>(`${this.#api}/${sku}`).pipe(
      tap((res) => {
        console.log(res)
        if(res.affected === 1) {
          //get item
          const item = this.variations.value.filter((tmpitem) => tmpitem.sku === sku );
          //remove image from image tabele
          this.images.update((arr) => arr.filter((image) => image !== item[0].image));
          //remo item from variations tabele
          const items = this.variations.value.filter((item) => item.sku !== sku);
          const tmp = items.slice(0);
          this.variations.next(tmp);
          this.snack.open('Item wurde entfernt', 'Ok', {duration: 1000})
        } else {
          this.errorService.newMessage(' Etwas ist schiefgelaufen, das Item wurde nicht gelöscht.')
        }
      })
    );
  }

  update(sku: string, produktVariations: Partial<iProduktVariations>) {
    return this.httpClient.put<iProduktVariations>(`${this.#api}/${sku}`, produktVariations);
  }
// upload image
uploadPhoto(file: File, productid: string, index: number) {
  const formData = new FormData();
  formData.append('photo', file);

  return this.httpClient.post(`${this.#api}/upload/${productid}`, formData, { reportProgress: true, observe: 'events' }).pipe(
    catchError((error) => {
      this.errorService.newMessage('Fehler beim Hochladen des Fotos.');
      return throwError(()=> error);
    }),
    finalize(() => this.resetFotoUpload()),
    tap((event) => {
      if(event.type == HttpEventType.UploadProgress && event.total) {
         this.helper.uploadProgersSig.set({ signal: Math.round(100 * (event.loaded / event.total)), index: index});

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
  this.helper.uploadProgersSig.set({ signal: 0, index : -1});
  this.break.next(EMPTY);
}
//get image
getImage(id: string) {
  if(id.split('//')[0] == 'https:')
  return this.getEbayImage(id);

  return this.httpClient.get(`${this.#api}/uploads/${id}`, { responseType: 'blob' }).pipe(
    catchError((err) => {
      this.errorService.newMessage(err.message);
      return throwError(()=> err);
    }),
    map((res) => {
      return res;
    } )
    );
}
  getEbayImage(id: string) {

    console.log('--ebay image variation serivce --')
    return this.httpClient.get(`${id}`, { responseType: 'blob' }).pipe(
      catchError((err) => {
        this.errorService.newMessage(err.message);
        return throwError(()=> err);
      }),
      map((res) => {
        return res;
      } )
      );
  }
//get thumbnails
getThumbnails(id: string) {
  if(id.split('://')[0] === 'https')
  this.getEbayImage(id);

  return  this.httpClient.get(`${this.#api}/thumbnails/${id}`, { responseType: 'blob' }).pipe(
    catchError((err) => {
      this.errorService.newMessage(err.message);
      return throwError(()=> err);
    }),
    map((res) => {
      return res;
    })
    );
}
deleteImage(image: iDelete) {

  return this.httpClient.post(`${this.#api}/file-delete`, image).pipe(
    catchError((err) => {
      this.errorService.newMessage(err.message);
      return throwError(()=> err);
    }),
    map((res) => {
      this.images.update((arr) => arr.filter((img) => img !== image.fileid));
      return res;
    })
  )
}
}
