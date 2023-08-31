import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, combineLatest, concatMap, map, of, startWith } from 'rxjs';
import { HelperService } from 'src/app/helper/helper.service';
import { iBestellung } from 'src/app/model/iBestellung';
import { iProductBestellung } from 'src/app/model/iProductBestellung';
import { iShippingAddress } from 'src/app/model/iShippingAddress';
import { iUserData } from 'src/app/model/iUserData';
import { UserService } from 'src/app/user/user.service';
import { PaypalComponent } from '../paypal/paypal.component';


@Component({
  selector: 'app-shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingAddressComponent {
  isLogged = this.helperService.isLogged();
  data$ = new Observable();
  act$ = combineLatest([ toObservable(this.helperService.isLogged), this.data$.pipe(startWith(null))]).pipe(concatMap(([log, res]) => this.getShippingAddress(log)),
  map((resp) => {

    this.data$ = of(resp);
    this.shippingAddres.patchValue(resp);
    return resp;
  }))
  shippingAddres : FormGroup;
  rechnungAddress: FormGroup;
  isRechnungAddress = false;

  constructor (private helperService: HelperService, private readonly userService: UserService, private readonly fb: FormBuilder,
    private readonly snack: MatSnackBar, private readonly dialog: MatDialog) {
    this.shippingAddres = this.fb.group({
      shipping_name: ['', Validators.required],
      strasse: ['', Validators.required],
      hausnummer: ['', Validators.required],
      email: ['', Validators.required],
      stadt: ['', Validators.required],
      postleitzahl: ['', Validators.required],
      land: ['', Validators.required],
    });
    this.rechnungAddress = this.fb.group({
      shipping_name: ['', Validators.required],
      strasse: ['', Validators.required],
      hausnummer: ['', Validators.required],
      stadt: ['', Validators.required],
      postleitzahl: ['', Validators.required],
      land: ['', Validators.required],
    });
  }


  getShippingAddress(log: boolean): Observable<iShippingAddress> {
    if(!log) return of({} as iShippingAddress);

    return  this.userService.getUserDetails().pipe(map(res => {

      const address = {} as iShippingAddress;
        Object.assign(address, res.adresse);

      address.shipping_name = res.vorname + ' ' + res.nachname;
      this.helperService.buyerAcc = res;
      this.shippingAddres.get('email')?.patchValue(res.email);
      return address;
    }))
  }
  async makeBestellung() {

    if  (this.shippingAddres.invalid || this.rechnungAddress.invalid && this.isRechnungAddress)  {

      this.snack.open('Das Formular ist nicht vollständig ausgefüllt', 'Ok', { duration: 3000 });
      return;
    }

    const user = {} as iUserData;
    if(this.helperService.buyerAcc.id) {
      Object.assign(user, this.helperService.buyerAcc);
    } else {
      user.email = this.shippingAddres.get('email')?.getRawValue();
      user.vorname = this.shippingAddres.get('shipping_name')?.getRawValue().split(' ')[0];
      user.nachname = this.shippingAddres.get('shipping_name')?.getRawValue().split(' ')[1];
      const address = {} as iShippingAddress;
      Object.assign(address, this.shippingAddres.value);
      user.adresse = address;
    }

     if(this.rechnungAddress.valid) {
        const shipAddress = {} as iShippingAddress;
        Object.assign(shipAddress, this.rechnungAddress.value);
        user.lieferadresse = shipAddress;
      } else {
        const address = {} as iShippingAddress;
        Object.assign(address, this.shippingAddres.value);
        user.lieferadresse = address;
      }

    const newBestellung = {} as iBestellung;
      newBestellung.kunde = user;

    const products: iProductBestellung[] = [];

    for (let i = 0; i < this.helperService.cardSig().length; i++) {
      const item = {} as iProductBestellung;
      item.color = this.helperService.cardSig()[i].color;
      item.produkt = [this.helperService.cardSig()[i]];
      products.push(item);
    }
    newBestellung.produkte = products;
    newBestellung.versandprice = Number(this.helperService.VersandAndKost().split('|')[1]);
    newBestellung.versandart = this.helperService.VersandAndKost().split('|')[0];

    const conf: MatDialogConfig = new MatDialogConfig();
    conf.width = '50%'
    conf.data = newBestellung;
    this.dialog.open(PaypalComponent, conf);
  }
}
