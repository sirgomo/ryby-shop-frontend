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
}
