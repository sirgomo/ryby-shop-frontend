import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, firstValueFrom, map, tap } from 'rxjs';
import { IShippingCost } from 'src/app/model/iShippingCost';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShippingCostService {
  #api = environment.api + 'shipping';
  shipping_cost: BehaviorSubject<IShippingCost[]> = new BehaviorSubject<IShippingCost[]>(null as any);
  shipping_costSig = toSignal(this.shipping_cost.asObservable().pipe(
    map((res) => {

      if(res === null)
       return this.getAllShipping();

    return res;
    }),

  ), { initialValue: [] as IShippingCost[] });
  constructor(private readonly httpC: HttpClient) { }

  getAllShipping(): Observable<IShippingCost[]> {
    return this.httpC.get<IShippingCost[]>(this.#api).pipe(map((res) => {
      if(!res) {
        this.shipping_cost.next([]);
        return [] as IShippingCost[];
      }
      this.shipping_cost.next(res);
      return res
    }));
  }

  createShipping(shipping: IShippingCost): Observable<IShippingCost> {
     return this.httpC.post<IShippingCost>(this.#api, shipping).pipe(
      tap((res => {
        if(res.id) {
          const current = []  as IShippingCost[];
          if(this.shipping_cost.value)
            current.push(...this.shipping_cost.value);

          current.push(res);
          const newCurrent = current.slice(0);
          this.shipping_cost.next(newCurrent);
        }
      }))
     );
  }

  updateShipping(shipping: IShippingCost): Observable<{raw: any, affected : number}> {
      return this.httpC.put<{raw: any, affected : number}>(`${this.#api}/${shipping.id}`, shipping).pipe(
        tap((res => {
          if(res.affected === 1) {
            const current = this.shipping_cost.value;
            const index = current.findIndex((el) => el.id === shipping.id);
            current[index] = shipping;
            const newCurrent = current.slice(0);
            this.shipping_cost.next(newCurrent);
          }
        })
      ));
    }

deleteShipping(id: number): Observable<{raw: any, affected : number}> {
      return this.httpC.delete<{raw: any, affected : number}>(`${this.#api}/${id}`)
      .pipe(
        tap((res => {
          if(res.affected === 1) {
            const current = this.shipping_cost.value;
            const index = current.findIndex((el) => el.id === id);
            current.splice(index, 1);
            const newCurrent = current.slice(0);
            this.shipping_cost.next(newCurrent);
          }
        })
      ));
    }
  }



