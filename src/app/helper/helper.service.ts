import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { iMenuItem } from '../model/iMenuItem';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  menuSub: BehaviorSubject<iMenuItem[]> = new BehaviorSubject<iMenuItem[]>([]);
  menu$ = this.menuSub.asObservable();
  constructor() { }
}
