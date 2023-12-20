import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, EMPTY, Observable, Subject, catchError, combineLatest, finalize, map, switchMap, takeUntil, tap, throwError } from 'rxjs';
import { ErrorService } from 'src/app/error/error.service';
import { HelperService } from 'src/app/helper/helper.service';
import { iEbayImageLink } from 'src/app/model/ebay/iEbayImageLink';
import { iDelete } from 'src/app/model/iDelete';
import { iItemActions } from 'src/app/model/iItemActions';
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
  acction: BehaviorSubject<iItemActions<any>> = new BehaviorSubject({} as iItemActions<any>);
  variations$ = combineLatest([this.acction.asObservable()]).pipe(switchMap(([act]) => {


    return this.findAllforSelect();
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
uploadPhoto(file: File, productid: string) {
  const formData = new FormData();
  formData.append('photo', file);

  return this.httpClient.post(`${this.#api}/upload/${productid}`, formData, { reportProgress: true, observe: 'events' }).pipe(
    catchError((error) => {
      this.errorService.newMessage('Fehler beim Hochladen des Fotos.');
      return throwError(()=> error);
    }),
    finalize(() => this.resetFotoUpload()),
    tap((event) => {

      if(event.type == HttpEventType.UploadProgress && event.total || event.type == 3 && event.total) {
        //console.log('dupa ' + event.loaded / event.total) ;
         this.helper.uploadProgersSig.set( Math.round(100 * (event.loaded / event.total)));
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
  return this.httpClient.post(`${this.#api}/uploads/`,{id: id}, { responseType: 'blob' }).pipe(
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
  try {
    return  this.httpClient.post(`${this.#api}/thumbnails/`,{id: id}, { responseType: 'blob' }).pipe(
      catchError((err) => {
        this.errorService.newMessage(err.message);
        return throwError(()=> err);
      }),
      map((res) => {
        return res;
      })
      );
  } catch (error) {
    this.errorService.newMessage(Object(error).message );
    return throwError(()=> error);
  }

}
deleteImage(image: iDelete) {

  return this.httpClient.post(`${this.#api}/file-delete`, image).pipe(
    catchError((err) => {
      this.errorService.newMessage(err.message);
      return throwError(()=> err);
    }),
    map((res) => {
      if(!image.product)
        this.images.update((arr) => arr.filter((img) => img !== image.fileid));

      return res;
    })
  )
}
//save ebay link or link from other source
saveEbayImageLink(link: iEbayImageLink) {
  return this.httpClient.post(`${this.#api}/imagelink`, link).pipe(map( res => {
   return res;
  }))
}
}
