  import { Injectable, signal } from '@angular/core';
  import { BehaviorSubject } from 'rxjs';
  import { iMenuItem } from '../model/iMenuItem';
  import { AppComponent } from '../app.component';
  import { iKategorie } from '../model/iKategorie';
  import { iProduct } from '../model/iProduct';
import { iUserData } from '../model/iUserData';
import { toSignal } from '@angular/core/rxjs-interop';
import { getMenu } from './menu';
import { environment } from 'src/environments/environment';

  @Injectable({
    providedIn: 'root'
  })
  export class HelperService {

    showLoader = new BehaviorSubject(false);
    showLoaderSig = toSignal(this.showLoader.asObservable());
    menuSub: BehaviorSubject<iMenuItem[]> = new BehaviorSubject<iMenuItem[]>([]);
    cardSig = signal<iProduct[]>([]);
    cardSigForMengeControl = signal<iProduct[]>([]);
    menu$ = this.menuSub.asObservable();
    titelSig = signal('Ryby');
    searchSig = signal<string>('');
    pageNrSig = signal<number>(1);
    kategorySig = signal<iKategorie>({} as iKategorie);
    artikelProSiteSig = signal<number> (0);
    isLogged = signal(false);
    uploadProgersSig = signal<number>(0);
    appComponenet!: AppComponent;
    buyerAcc: iUserData = {} as iUserData;
    VersandAndKost = signal('');
    paginationCountSig = signal(0);
    constructor() { }
    setApp(app: AppComponent) {
      this.appComponenet = app;
    }
    getLoginWindow() {
      if(this.appComponenet === undefined )
        return;

      return this.appComponenet.login();
    }
    setMenu(role: string) {
      this.menuSub.next(getMenu(role));
    }
    showCookiesPolitics() {
      this.appComponenet.askCookies();
    }
  }
  //return random string of two characters or zifern + -_
export function getUniqueSymbol(): string {
  const sequence = 'abcdefghijklmnoprstuwxyzABCDEFGHIJKLMNOPRSTUWXYZ1234567890-_';
    return sequence[(Math.floor(Math.random() * sequence.length))]+sequence[(Math.floor(Math.random() * sequence.length))];
}

