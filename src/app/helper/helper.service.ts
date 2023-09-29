  import { Injectable, signal } from '@angular/core';
  import { BehaviorSubject } from 'rxjs';
  import { iMenuItem } from '../model/iMenuItem';
  import { AppComponent } from '../app.component';
  import { iKategorie } from '../model/iKategorie';
  import { iProduct } from '../model/iProduct';
import { iShippingAddress } from '../model/iShippingAddress';
import { iUserData } from '../model/iUserData';

  @Injectable({
    providedIn: 'root'
  })
  export class HelperService {
    showLoaderSig = signal(false);
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
      const menu: iMenuItem[] = [];
      if(role === 'ADMIN') {
        menu[0] = { name: 'Admin Panel', link: 'admin' };
        menu[1] = { name: 'Liferants', link: 'liferant' };
        menu[2] = { name: 'Kategories', link: 'kategory'};
        menu[3] = { name: 'User Panel', link: 'user' };
        menu[4] = { name: 'Products', link: 'product' };
        menu[5] = { name: 'Waren Eingang', link: 'waren-eingang' };
        menu[6] = { name: 'Company', link: 'company' };
        menu[7] = { name: 'Bestellungen', link: 'admin-order'};
        menu[8] = { name: 'Ebay', link: 'ebay'};
      } else if (role === 'USER') {
        menu[0] = { name: 'User Profil', link: 'user' };
        menu[1] = { name: 'Mein Bestellungen', link: 'order' }
      }
      this.menuSub.next(menu);
    }
    showCookiesPolitics() {
      this.appComponenet.askCookies();
    }
  }
