import { ChangeDetectionStrategy, Component, Inject, Optional } from '@angular/core';
import { WareneingangService } from '../wareneingang.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { iWareneingangProduct } from 'src/app/model/iWareneingangProduct';
import { ErrorService } from 'src/app/error/error.service';
import { iProduct } from 'src/app/model/iProduct';
import { iWarenEingang } from 'src/app/model/iWarenEingang';
import { Observable, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from 'src/app/error/error.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-edit-product-to-buchung',
  templateUrl: './add-edit-product-to-buchung.component.html',
  styleUrls: ['./add-edit-product-to-buchung.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ErrorComponent, FormsModule, MatIconModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule]
})
export class AddEditProductToBuchungComponent {
  wareneingang = this.wEingService.currentWarenEingangSig();
  wEingangProduct: FormGroup;

  act$ = new Observable();
  constructor (private wEingService: WareneingangService, @Optional() @Inject(MAT_DIALOG_DATA) public data: iWareneingangProduct, private fb: FormBuilder,
  private dialRef: MatDialogRef<AddEditProductToBuchungComponent>,
  public errMessage: ErrorService,
  private snackBar: MatSnackBar ) {

    this.wEingangProduct =  this.fb.group({
        id: [ this.data && this.data.id ? this.data.id : null],
        wareneingang: [ this.wareneingang],
        produkt: [ this.data && this.data.produkt ? this.data.produkt[0].name : null],
        menge: [{ value: this.data && this.data.menge ? this.data.menge : 0, disabled: true}],
        preis: [ this.data && this.data.preis ? Number(this.data.preis) : 0],
        mwst: [ this.data && this.data.mwst ? this.data.mwst : 0],
        mengeEingelagert: [ { value: this.data && this.data.mengeEingelagert ? this.data.mengeEingelagert : 0, disabled: true} ],
        color:  this.fb.array([]),
    });


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
    if (!this.data.produkt[0].id || !this.wareneingang?.data.id || this.wEingangProduct.get('menge')?.getRawValue() <= 0 || this.wEingangProduct.get('preis')?.getRawValue() <= 0 ) {
      this.snackBar.open('Etwas stimmit nicht', 'Ok', { duration: 2000 })
      return;
    }
    const wEinprod: iWareneingangProduct = {} as iWareneingangProduct;
    const prod: iProduct = {} as iProduct;
    const wEingang: iWarenEingang = {} as iWarenEingang;
    wEingang.id = this.wareneingang?.data.id;
    prod.id = this.data.produkt[0].id;

    Object.assign(wEinprod, this.wEingangProduct.value);
    wEinprod.produkt = [prod];
    wEinprod.wareneingang = wEingang;
    wEinprod.mengeEingelagert = 0;
    wEinprod.menge = this.wEingangProduct.get('menge')?.getRawValue();
    wEinprod.color = JSON.stringify(this.wEingangProduct.get('color')?.getRawValue());
    //new product in buchung
    if(wEingang.id && this.data.id === undefined)
      this.act$ = this.wEingService.addProductToWarenEingang(wEingang.id, wEinprod).pipe(tap(res => {
        if(res.id) {
          this.data.id = res.id;
          res.produkt = this.data.produkt;
          this.wEingService.currentProductsInBuchungSig().push(res);
          this.snackBar.open('Gespichert', 'Ok', { duration: 1500 })
          this.dialRef.close();
        }

      }))
      //edited product in buchung
      if(wEingang.id && this.data.id && wEinprod.id)
      this.act$ = this.wEingService.updateProductInWarenEingang(wEingang.id, wEinprod.id, wEinprod).pipe(tap(res => {
        if(res.id) {
        const items =  this.wEingService.currentProductsInBuchungSig();
        const index = items.findIndex((tmp) => tmp.id === res.id);
        const newItems = items.slice(0);
        newItems[index] = res;
        newItems[index].produkt = items[index].produkt;
        this.wEingService.currentProductsInBuchungSig.set(newItems);
          this.data.id = res.id;
          this.snackBar.open('Gespichert und updated', 'Ok', { duration: 1500 })
          this.dialRef.close();
        }

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
