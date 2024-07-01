import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, EMPTY, Observable, Subject, catchError, combineLatest, map, of, switchMap, tap } from 'rxjs';
import { ErrorService } from 'src/app/error/error.service';
import { HelperService } from 'src/app/helper/helper.service';
import { iItemActions } from 'src/app/model/iItemActions';
import { LOGS_CLASS, iLogs } from 'src/app/model/iLogs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  #api = environment.api + 'logs';
  errorClasSig = signal<LOGS_CLASS>(LOGS_CLASS.NULL);
  current_error_class: LOGS_CLASS = LOGS_CLASS.NULL;
  logsSub: BehaviorSubject<iLogs[]> = new BehaviorSubject<iLogs[]>([]);
  accSub: BehaviorSubject<iItemActions<any>> = new BehaviorSubject<iItemActions<any>>({ item: {}, action: 'donothing'});
  logs$ = combineLatest([ this.accSub.asObservable(), toObservable(this.errorClasSig),
     toObservable(this.helperService.pageNrSig), toObservable(this.helperService.artikelProSiteSig) ]).pipe(
    switchMap(([act, er_class, sitenr, take]) => {
      if(take < 10)
        return this.logsSub.asObservable();

      if(act.action === 'getall')
       return this.getAllLogs(er_class, sitenr, take);

      if(act.action === 'delete')
       return this.deleteLogById(act.item.id);

      return this.logsSub.asObservable();
    })
  )

  constructor(private readonly http: HttpClient, private helperService: HelperService, private readonly snackBar: MatSnackBar, private readonly errorService: ErrorService) { }

  getAllLogs(er_class: LOGS_CLASS, sitenr: number, take: number): Observable<iLogs[]> {

    if(er_class !== this.current_error_class) {
      this.current_error_class = er_class;
      this.helperService.pageNrSig.set(1);
    }

    return this.http.get<[iLogs[], number]>(`${this.#api}/${er_class}/${sitenr}/${take}`).pipe(map((res) => {
      this.helperService.paginationCountSig.set(res[1]);
      this.logsSub.next(res[0]);
      return res[0];
    }),
    catchError((err) => {
      this.errorService.newMessage(err.message);
      return of([])
    }));
  }

  getLogsByClass(logsClass: string): Observable<iLogs[]> {
    return this.http.get<iLogs[]>(`${this.#api}class/${logsClass}`);
  }

  getLogById(id: number): Observable<iLogs> {
    return this.http.get<iLogs>(`${this.#api}/${id}`);
  }

  deleteLogById(id: number): Observable<{ raw: any, affected: number}> {
    return this.http.delete<{ raw: any, affected: number}>(`${this.#api}/${id}`).pipe(tap(res => {

      if(res.affected === 1) {
        const newLogs = this.logsSub.value.filter((item) => item.id !== id);
        this.logsSub.next(newLogs);
        this.accSub.next({ item: {}, action: 'getall' });
        this.snackBar.open('Log eintrag mit id ' + id + ' wurde gelöscht', 'Ok', { duration: 1500 });
      } else {
        this.snackBar.open('Log eintrag mit id ' + id + ' kann nicht gelöscht werden, FEHLER', 'Ok', { duration: 3000 });
      }
    }),
    catchError((err) => {
      this.errorService.newMessage(err.message);
      this.accSub.next({ item: {}, action: 'donothing' });
      return of({ raw: '', affected: 0 })
    })
    );
  }
}
