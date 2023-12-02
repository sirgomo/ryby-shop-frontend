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
import { IShippingCost } from '../model/iShippingCost';
import { EbayService } from '../ebay/ebay.service';

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
    titelSig = signal(environment.site_title);
    searchSig = signal<string>('');
    pageNrSig = signal<number>(1);
    kategorySig = signal<iKategorie>({} as iKategorie);
    artikelProSiteSig = signal<number> (0);
    isLogged = signal(false);
    uploadProgersSig = signal<number>(0);
    appComponenet!: AppComponent;
    buyerAcc: iUserData = {} as iUserData;
    versandAndKost = signal<IShippingCost[]>([{ shipping_name: 'Selbstabholung', shipping_price: 0, average_material_price: 0 }]);
    selectedVersandMethod : IShippingCost | null = null;
    paginationCountSig = signal(0);
    isShippingCostSelected = signal(false);

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
export function getProductUrl(path: string, itemid: number, itemName: string) {
  return [path, itemid, itemName.replace(/[^a-zA-Z0-9üöäÜÖÄ]/g,'-').replace(/-+/g, '-').replace(/^-|-$/g, '')];
}

