import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WareneingangService {
  API = environment.api + 'waren-eingang-buchen'
  constructor() { }
}
