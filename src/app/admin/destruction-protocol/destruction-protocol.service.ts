import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, EMPTY, Observable, catchError, firstValueFrom, map, of, switchMap, tap } from 'rxjs';
import { iDestructionProtocol } from 'src/app/model/iDestructionProtocol';
import { iItemActions } from 'src/app/model/iItemActions';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DestructionProtocolService {
  #api = environment.api + 'destruction-pro';
  itemsSig = signal<iDestructionProtocol[]>([])
  actionSig = signal<iItemActions<iDestructionProtocol>>({item: {} as any, action: 'donothing'});
  litems$ = toObservable(this.actionSig).pipe(
    switchMap((action) => {
      if (action.action === 'getall')
        return this.getProtocols();
      else if (action.action === ' edit')
        return this.editProtocol(action.item.id, action.item);
      else if (action.action === 'add') {
        console.log(action)
        return this.createProtocol(action.item);
      }
      else if (action.action === 'delete')
        return this.deleteProtocolById(action.item.id);


      return this.itemsSig();
    })
  )
  constructor(private readonly httpClient: HttpClient) {}
// Fetch all protocols with pagination
getProtocols(page: number = 1, limit: number = 10): Observable<[iDestructionProtocol[], number]> {
  console.log('getProtocols...')
  return this.httpClient.get<[iDestructionProtocol[], number]>(`${this.#api}?page=${page}&limit=${limit}`).pipe(map((res) => {
    this.itemsSig.set(res[0]);
    return res;
  }));
}

// Fetch a single protocol by ID
getProtocolById(id: number): Observable<iDestructionProtocol> {
  console.log('getvyid')
  return this.httpClient.get<iDestructionProtocol>(`${this.#api}/${id}`);
}

// Create a new protocol
createProtocol(protocol: iDestructionProtocol): Observable<iDestructionProtocol> {
  console.log('create')
  return this.httpClient.post<iDestructionProtocol>(this.#api, protocol).pipe(tap((res) => {
    console.log(res);
  }), catchError((err) => {
    console.log(err);
    return of({} as iDestructionProtocol);
  })
);
}

// Delete a protocol by ID
deleteProtocolById(id: number): Observable<{ affected: number, raw: string }> {
  return this.httpClient.delete<{affected: number, raw: string}>(`${this.#api}/${id}`);
}

// Update a protocol by ID
editProtocol(id: number, protocol: any): Observable<iDestructionProtocol> {
  return this.httpClient.put<iDestructionProtocol>(`${this.#api}/${id}`, protocol);
}

}
