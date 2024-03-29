import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { EMPTY, Observable, catchError, lastValueFrom, map, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { iAktion } from '../model/iAktion';
import { iItemActions } from '../model/iItemActions';
import { toObservable } from '@angular/core/rxjs-interop';
import { ErrorService } from '../error/error.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AktionComponent } from './aktion.component';

@Injectable({
  providedIn: 'root'
})
export class AktionService {
  #api = environment.api + 'aktion';
  itemsSig = signal<iAktion[]>([]);
  actionSig = signal<iItemActions<iAktion>>({ item: {} as iAktion, action: 'donothing'});
  aktCompo: AktionComponent | undefined;
  items$ = lastValueFrom(toObservable(this.actionSig).pipe(
    switchMap((action) => {
        if(action.action === 'add')
          return this.createPromotionCode(action.item);

        if(action.action === 'delete')
          return this.deletePromotionCode(action.item);

        if(action.action === ' edit')
          return this.updatePromotionCode(action.item);

        if(action.action === 'getall')
        return this.getAllAktions();

        return this.itemsSig();
    })
  ))
  constructor(private readonly http: HttpClient, private readonly errorServicce: ErrorService, private readonly snack: MatSnackBar) { }

  getAllAktions(): Observable<iAktion[]> {
    return this.http.get<iAktion[]>(this.#api).pipe(map(res => {
      this.itemsSig.set(res);
      this.aktCompo?.reloadAktions(this.itemsSig());
      return res;
    }),
    catchError((err) => {
      this.errorServicce.newMessage(err.message);
      return [];
    })
    );
  }
  createPromotionCode(item: iAktion) {
    return this.http.post<iAktion>(this.#api, item).pipe(tap(res => {
      if(res.id) {
        const items = [...this.itemsSig(), res];
        this.itemsSig.set(items);
        this.aktCompo?.reloadAktions(this.itemsSig());
        this.snack.open('Promotion Code würde gespeichert', 'Ok', { duration: 1500 })
      }
      return res;
    }),
    catchError((err) => {
      this.errorServicce.newMessage(err.message);
      return this.itemsSig();
    }));
  }
  updatePromotionCode(item: iAktion) {
    if (!item.id)
      return this.itemsSig();

      return this.http.put<{affected: number}>(this.#api+'/'+item.id, item).pipe(tap(res => {
        if(res.affected === 1) {
          this.itemsSig.update((tab) => {
            const index = tab.findIndex((tmp) => tmp.id === item.id);
            if (index === -1) {
              this.snack.open(' Error, id wurde nicht gefunden', 'Ok', { duration: 3000 });
              return this.itemsSig();
            }
              const items = tab.slice(0);
              items[index] = item;

              return items;
          })
        }
      }),
      catchError((err) => {
        this.errorServicce.newMessage(err.message);
        return this.itemsSig();
      })
      )

  }
  deletePromotionCode(item: iAktion) {
    if(!item.id)
      return this.itemsSig();

    return this.http.delete<{affected: number, raw: any}>(this.#api+'/'+item.id).pipe(tap(res => {
      if(res.affected === 1) {
        const items = this.itemsSig().filter((tmp) => tmp.id !== item.id);
        this.itemsSig.set(items);
        this.aktCompo?.reloadAktions(this.itemsSig());
        this.snack.open('Promotion Code würde gelöscht', 'Ok', { duration: 1500 })
      }
      return res;
    }),
    catchError((err) => {
      this.errorServicce.newMessage(err.message);
      return this.itemsSig();
    }));
  }
  getPromotionOnCode(code: string, prodid: number) {
    return this.http.get<any>(this.#api+'/promo/'+code+'/'+prodid).pipe(
      catchError(err => {
        this.errorServicce.newMessage(err.message);
        return of({});
      })
    )
  }
}
