import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ProductService } from 'src/app/admin/product/product.service';



@Component({
  selector: 'app-shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatFormFieldModule, ReactiveFormsModule, MatCheckboxModule, MatInputModule, MatButtonModule, CommonModule, FormsModule]
})
export class ShippingAddressComponent {
  isLogged = this.helperService.isLogged();
  data$ = new Observable();
  versand = this.helperService.versandAndKost;
  act$ = combineLatest([ toObservable(this.helperService.isLogged), this.data$.pipe(startWith(null))]).pipe(concatMap(([log, res]) => this.getShippingAddress(log)),
  map((resp) => {

    this.data$ = of(resp);
    this.shippingAddres.patchValue(resp);
    return resp;
  }))
  shippingAddres : FormGroup;
  rechnungAddress: FormGroup;
  isRechnungAddress = false;

  constructor (public readonly helperService: HelperService, private readonly userService: UserService, private readonly fb: FormBuilder,
    private readonly snack: MatSnackBar, private readonly dialog: MatDialog, private reouter: Router, private readonly producService: ProductService) {
    this.shippingAddres = this.fb.group({
      shipping_name: ['', Validators.required],
      strasse: ['', Validators.required],
      hausnummer: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
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

      address.shipping_name = res.nachname + ' ' + res.vorname;
      this.helperService.buyerAcc = res;
      this.shippingAddres.get('email')?.patchValue(res.email);
      return address;
    }))
  }
  async makeBestellung() {

    if  (this.shippingAddres.invalid || this.rechnungAddress.invalid && this.isRechnungAddress )  {

      this.snack.open('Das Formular ist nicht vollständig ausgefüllt', 'Ok', { duration: 3000 });
      return;
    }

    const user = {} as iUserData;
    if(this.helperService.buyerAcc.id) {
      Object.assign(user, this.helperService.buyerAcc);
    } else {
      user.email = this.shippingAddres.get('email')?.getRawValue();
      user.vorname = this.shippingAddres.get('shipping_name')?.getRawValue().split(' ')[1];
      user.nachname = this.shippingAddres.get('shipping_name')?.getRawValue().split(' ')[0];
      const address = {} as iShippingAddress;
      Object.assign(address, this.shippingAddres.value);
      user.adresse = address;
    }

     if(this.rechnungAddress.valid) {
        const shipAddress = {} as iShippingAddress;
        Object.assign(shipAddress, this.rechnungAddress.value);
        user.lieferadresse = shipAddress;
      }

    const newBestellung = {} as iBestellung;
      newBestellung.kunde = user;

    const products: iProductBestellung[] = [];

    for (let i = 0; i < this.helperService.cardSig().length; i++) {
      const item = {} as iProductBestellung;
      item.produkt = [this.helperService.cardSig()[i]];
      products.push(item);
    }
    newBestellung.produkte = products;
    if(this.helperService.selectedVersandMethod !== null) {
      newBestellung.versandprice = Number(this.helperService.selectedVersandMethod.shipping_price);
      newBestellung.versandart = this.helperService.selectedVersandMethod.shipping_name;
    } else {
      this.snack.open('Bitte wählen Sie eine Versandart', 'Ok', { duration: 3000 });
    }


    const conf: MatDialogConfig = new MatDialogConfig();
    conf.width = '50%'
    conf.data = newBestellung;
    const subs$ = this.dialog.open(PaypalComponent, conf).afterClosed().subscribe((cl) => {
      if(cl && cl === 'COMPLETED') {

        this.resetCard();
        this.snack.open('Vielen Dank für Ihren Einkauf!', 'Ok', {duration: 2500 });
        this.reouter.navigate(['/']);
      }
      subs$.unsubscribe();
    });
  }

  private resetCard() {
    //reset products
    this.helperService.cardSig.set([]);
    this.helperService.cardSigForMengeControl.set([]);
  }
}
