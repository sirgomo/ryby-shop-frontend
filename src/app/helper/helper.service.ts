import { Injectable } from '@angular/core';
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
  appComponenet!: AppComponent;
  constructor() { }
  setApp(app: AppComponent) {
    this.appComponenet = app;
  }
  getLoginWindow() {
    return this.appComponenet.login();
  }
}
