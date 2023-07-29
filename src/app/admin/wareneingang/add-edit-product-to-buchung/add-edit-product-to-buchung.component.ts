import { ChangeDetectionStrategy, Component, Inject, Optional } from '@angular/core';
import { WareneingangService } from '../wareneingang.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { iWareneingangProduct } from 'src/app/model/iWareneingangProduct';
import { iColor } from 'src/app/model/iColor';
import { ErrorService } from 'src/app/error/error.service';
import { iProduct } from 'src/app/model/iProduct';
import { iWarenEingang } from 'src/app/model/iWarenEingang';
import { Observable, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-edit-product-to-buchung',
  templateUrl: './add-edit-product-to-buchung.component.html',
  styleUrls: ['./add-edit-product-to-buchung.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditProductToBuchungComponent {
  wareneingang = this.wEingService.currentWarenEingangSig();
  wEingangProduct: FormGroup;
  colors: iColor[] = JSON.parse( this.data.produkt.color);
  act$ = new Observable();
  constructor (private wEingService: WareneingangService, @Optional() @Inject(MAT_DIALOG_DATA) public data: iWareneingangProduct, private fb: FormBuilder,
  private dialRef: MatDialogRef<AddEditProductToBuchungComponent>,
  public errMessage: ErrorService,
  private snackBar: MatSnackBar ) {

    this.wEingangProduct =  this.fb.group({
        id: [ this.data && this.data.id ? this.data.id : null],
        wareneingang: [ this.wareneingang],
        produkt: [ this.data && this.data.produkt ? this.data.produkt.name : null],
        menge: [{ value: this.data && this.data.menge ? this.data.menge : 0, disabled: true}],
        preis: [ this.data && this.data.preis ? this.data.preis : 0],
        mwst: [ this.data && this.data.mwst ? this.data.mwst : 0],
        mengeEingelagert: [ { value: this.data && this.data.mengeEingelagert ? this.data.mengeEingelagert : 0, disabled: true} ],
        color: this.fb.array([]),
    });
    //add colors to form
   for (let i = 0; i < this.colors.length; i++) {
    const item = this.colorForm();
    item.patchValue(this.colors[i]);
      this.getColor().push(item)
   }
   //No color, but the article has to have at least one color
   if(this.colors.length === 0) {
    const item = this.colorForm();
    item.get('id')?.setValue('farbe 01')
      this.getColor().push(item)
   }
  }
  close() {
    this.dialRef.close();
  }
  getColor() {
    return this.wEingangProduct.controls['color'] as FormArray;
  }
  colorForm() {
    return this.fb.group({
      id: [''],
      menge: 0,
    })
  }
  getItem(item: AbstractControl) {
    return item as FormGroup;
  }
  save() {
    if (!this.data.produkt.id || !this.wareneingang?.data.id || this.wEingangProduct.get('menge')?.getRawValue() <= 0 || this.wEingangProduct.get('preis')?.getRawValue() <= 0 ) {
      this.snackBar.open('Etwas stimmit nicht', 'Ok', { duration: 2000 })
      return;
    }
    const wEinprod: iWareneingangProduct = {} as iWareneingangProduct;
    const prod: iProduct = {} as iProduct;
    const wEingang: iWarenEingang = {} as iWarenEingang;
    wEingang.id = this.wareneingang?.data.id;
    prod.id = this.data.produkt.id;
    Object.assign(wEinprod, this.wEingangProduct.value);
    wEinprod.produkt = prod;
    wEinprod.wareneingang = wEingang;
    wEinprod.mengeEingelagert = 0;
    wEinprod.menge = this.wEingangProduct.get('menge')?.getRawValue();
    console.log(wEinprod)
    if(wEingang.id && this.data.id === undefined)
      this.act$ = this.wEingService.addProductToWarenEingang(wEingang.id, wEinprod).pipe(tap(res => {
       this.wEingangProduct.patchValue(res);
       this.data.id = res.id;
      }))
      if(wEingang.id && this.data.id && wEinprod.id)
      this.act$ = this.wEingService.updateProductInWarenEingang(wEingang.id, wEinprod.id, wEinprod).pipe(tap(res => {
        this.wEingangProduct.patchValue(res);
        this.data.id = res.id;
       }))
  }
  onChangeFarbeMenge() {
    let newMenge = 0;
    for( let i = 0; i < this.getColor().length; i++) {
     newMenge += this.getColor().at(i).get('menge')?.getRawValue();
    }
    this.wEingangProduct.get('menge')?.setValue(newMenge);
  }
}
