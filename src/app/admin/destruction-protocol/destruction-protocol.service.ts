import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {  EMPTY, Observable, catchError,  map, of, switchMap, tap } from 'rxjs';
import { ErrorService } from 'src/app/error/error.service';
import { iDestructionProtocol } from 'src/app/model/iDestructionProtocol';
import { iItemActions } from 'src/app/model/iItemActions';
import { iProduct } from 'src/app/model/iProduct';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DestructionProtocolService {
  #api = environment.api + 'destruction-pro';
  #api_prod = environment.api + 'product';
  itemsSig = signal<iDestructionProtocol[]>([])
  actionSig = signal<iItemActions<iDestructionProtocol>>({item: {} as any, action: 'donothing'});
  litems$ = toObservable(this.actionSig).pipe(
    switchMap((action) => {
      switch(action.action) {
        case 'add':
          return this.createProtocol(action.item);
        case 'get':
          return this.getProtocolById(action.item.id);
        case ' edit':
          return this.editProtocol(action.item.id, action.item);
        case 'delete':
          return this.deleteProtocolById(action.item.id);
        case 'getall':
          return this.getProtocols();

        default:
          return this.itemsSig();
      }
    })
  )
  constructor(private readonly httpClient: HttpClient, private errorService: ErrorService) {}
// Fetch all protocols with pagination
getProtocols(page: number = 1, limit: number = 10): Observable<[iDestructionProtocol[], number]> {
  return this.httpClient.get<[iDestructionProtocol[], number]>(`${this.#api}?page=${page}&limit=${limit}`).pipe(map((res) => {
    this.itemsSig.set(res[0]);
    return res;
  }));
}

// Fetch a single protocol by ID
getProtocolById(id: number): Observable<iDestructionProtocol> {
  return this.httpClient.get<iDestructionProtocol>(`${this.#api}/${id}`);
}

// Create a new protocol
createProtocol(protocol: iDestructionProtocol): Observable<iDestructionProtocol> {
  return this.httpClient.post<iDestructionProtocol>(this.#api, protocol).pipe(tap((res) => {
    if(res.id) {
      this.itemsSig.update((items) => [...items, res]);
      this.actionSig.set({ item: {} as any, action: 'donothing'})
    }
  }), catchError((err) => {
    this.errorService.newMessage(err.error.message);
    return of({} as iDestructionProtocol);
  })
);
}

// Delete a protocol by ID
deleteProtocolById(id: number): Observable<{ affected: number, raw: string }> {
  return this.httpClient.delete<{affected: number, raw: string}>(`${this.#api}/${id}`).pipe(tap((res) => {
    if(res.affected === 1) {
      this.itemsSig.update((items) => {
        const newItmes = items.filter((item) => item.id !== id);
        return newItmes;
      })
      this.actionSig.set({ item: {} as any, action: 'donothing'})
    } else {
      console.log(res)
      this.errorService.newMessage('Etwas ist schiefgelaufen, Protocol wurde nicht gelöscht');
    }
  }),
  catchError((err) => {
    console.log(err.message)
    this.errorService.newMessage('Etwas ist schiefgelaufen, Protocol wurde nicht gelöscht');
    return EMPTY
  })
);
}

// Update a protocol by ID
editProtocol(id: number, protocol: any): Observable<iDestructionProtocol> {
    return this.httpClient.put<iDestructionProtocol>(`${this.#api}/${id}`, protocol).pipe(tap((res) => {
      if (res.id) {
        this.itemsSig.update((items) => {
          const index = items.findIndex((item) => item.id === res.id);
          const itemsnew = items.slice(0);
          itemsnew[index] = res;
          return itemsnew;
        })

        this.actionSig.set({ item: {} as any, action: 'donothing'})
      } else {
        console.log(res)
        this.errorService.newMessage('Etwas ist schiefgelaufen, Protocol wurde nicht geändert');
        this.actionSig.set({ item: {} as any, action: 'donothing'})
      }

    }),
    catchError((err) => {
      console.log(err.message)
      this.errorService.newMessage('Etwas ist schiefgelaufen, Protocol wurde nicht geändert');
      this.actionSig.set({ item: {} as any, action: 'donothing'})
      return EMPTY
    })
  );
}
getProductByName(name: string): Observable<[iProduct[], number]> {
  if(name.length < 3)
    return EMPTY;

  return this.httpClient.get<[iProduct[], number]>(`${this.#api_prod}/${name}/0/10/1` );
}

}
