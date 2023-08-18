import { Component, Input, OnInit } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, combineLatest, concatMap, map, of, startWith } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { HelperService } from 'src/app/helper/helper.service';
import { iShippingAddress } from 'src/app/model/iShippingAddress';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.scss']
})
export class ShippingAddressComponent {
  isLogged = this.helperService.isLogged();
  data$ = new Observable();
  act$ = combineLatest([ toObservable(this.helperService.isLogged), this.data$.pipe(startWith(null))]).pipe(concatMap(([log, res]) => this.getShippingAddress(log)),
  map((resp) => {
    this.data$ = of(resp);
    return resp;
  }))
  constructor (private helperService: HelperService, private readonly userService: UserService) {}

  getShippingAddress(log: boolean): Observable<iShippingAddress> {
    console.log('przed if')
    if(!log) return of({} as iShippingAddress);

    return  this.userService.getUserDetails().pipe(map(res => {

      const address = {} as iShippingAddress;
        Object.assign(address, res.adresse);
      if(res.lieferadresse)
        Object.assign(address, res.lieferadresse);

      return address;
    }))
  }
}
