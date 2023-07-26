import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { iMenuItem } from '../model/iMenuItem';
import { ToolbarComponent } from '../toolbar/toolbar/toolbar.component';
import { AppComponent } from '../app.component';
import { iKategorie } from '../model/iKategorie';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  menuSub: BehaviorSubject<iMenuItem[]> = new BehaviorSubject<iMenuItem[]>([]);
  menu$ = this.menuSub.asObservable();
  titelSig = signal('Ryby');
  searchSig = signal<string>('');
  pageNrSig = signal<number>(1);
  kategorySig = signal<iKategorie>({} as iKategorie);
  artikelProSiteSig = signal<number> (20);
  isLogged = signal(false);
  uploadProgersSig = signal<number>(0);
  appComponenet!: AppComponent;
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
    } else if (role === 'USER') {
      menu[0] = { name: 'User Panel', link: 'user' };
    }
    this.menuSub.next(menu);
  }
}
