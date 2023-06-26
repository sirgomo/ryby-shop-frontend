import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { iMenuItem } from '../model/iMenuItem';
import { ToolbarComponent } from '../toolbar/toolbar/toolbar.component';
import { AppComponent } from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  menuSub: BehaviorSubject<iMenuItem[]> = new BehaviorSubject<iMenuItem[]>([]);
  menu$ = this.menuSub.asObservable();
  isLogged = signal(false);
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
    } else if (role === 'USER') {
      menu[0] = { name: 'User Panel', link: 'user' };
    }
    this.menuSub.next(menu);
  }
}
