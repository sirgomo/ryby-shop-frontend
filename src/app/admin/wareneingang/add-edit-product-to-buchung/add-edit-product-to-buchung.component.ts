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
import { iWarenEingangProdVariation } from 'src/app/model/iWarenEingangProdVariation';

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
        product_variation: this.fb.array([]),
    });
    //no data new product in goods receipt
    if(!this.data.id && this.data.produkt)
    for (let i = 0; i < this.data.produkt[0].variations.length; i++) {
     const tmp : iWarenEingangProdVariation = {} as iWarenEingangProdVariation;

      if(!tmp.sku)
        tmp.sku = this.data.produkt[0].variations[i].sku;


      this.product_variation.push(this.colorForm(tmp));
    }
    //product current in goods receipt
    if(this.data && this.data.id) {

      const tmp : iWarenEingangProdVariation = {} as iWarenEingangProdVariation;
      if(this.data.id) {
        for(let y = 0; y < this.data.product_variation.length; y++) {

          tmp.id = this.data.product_variation[y].id;
          tmp.quanity = this.data.product_variation[y].quanity;
          tmp.price = this.data.product_variation[y].price;
          tmp.price_in_euro = this.data.product_variation[y].price_in_euro;
          tmp.wholesale_price = this.data.product_variation[y].wholesale_price;
          tmp.mwst = this.data.product_variation[y].mwst;
          tmp.quanity_stored = this.data.product_variation[y].quanity_stored;
          tmp.sku = this.data.product_variation[y].sku;
          tmp.waren_eingang_product = this.data;
          this.product_variation.push(this.colorForm(tmp));
      }
          for (let i = 0; i < this.data.produkt[0].variations.length; i++) {
              const index = this.data.product_variation.findIndex((item) => item.sku === this.data.produkt[0].variations[i].sku);

              if(index === -1) {
                tmp.id = undefined;
                tmp.quanity = 0;
                tmp.price = 0;
                tmp.price_in_euro = 0;
                tmp.mwst = 0;
                tmp.wholesale_price = 0;
                tmp.quanity_stored = 0;
                tmp.sku = this.data.produkt[0].variations[i].sku;
                tmp.waren_eingang_product = this.data;

                this.product_variation.push(this.colorForm(tmp));
              }
          }

       }

    }
  }
  close() {
    this.dialRef.close();
  }
  get product_variation() {
    return this.wEingangProduct.controls['product_variation'] as FormArray;
  }
  colorForm(item? : iWarenEingangProdVariation) {

    return this.fb.group({
      id: [item?.id ? item.id : null],
      sku: [ item ? { value: item.sku, disabled: true } : null],
      quanity: [item?.quanity ? item.quanity : 0],
      price: [item?.price ? item.price : 0],
      price_in_euro: [ {value: item?.price_in_euro ? item.price_in_euro : 0, disabled: true}],
      wholesale_price: [item?.wholesale_price ? item.wholesale_price : 0],
      mwst: [item?.mwst ? item.mwst: 0],
      quanity_stored: [item?.quanity_stored ? item.quanity_stored : 0],
    });
  }
  getItem(item: AbstractControl) {
    return item as FormGroup;
  }
  save() {
    if (!this.data.produkt[0].id || !this.wareneingang?.data.id  ) {
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
    wEinprod.product_variation = this.getVariations();


    //new product in buchung
    if(wEingang.id && this.data.id === undefined)
      this.act$ = this.wEingService.addProductToWarenEingang(wEingang.id, wEinprod).pipe(tap(res => {
        if(res.id) {
          this.data.id = res.id;
          res.produkt = this.data.produkt;
          this.wEingService.currentProductsInBuchungSig.update((alt) => [...alt, res]);
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


  private getVariations() {

    const products: iWarenEingangProdVariation[] = [];
    for (let i = 0; i < this.product_variation.getRawValue().length; i++) {

      if (this.product_variation.getRawValue()[i].quanity > 0) {
        const tmp: iWarenEingangProdVariation = {} as iWarenEingangProdVariation;
        Object.assign(tmp, this.product_variation.getRawValue()[i]);
        if(!this.product_variation.getRawValue()[i].quanity_stored)
          tmp.quanity_stored = 0;

        if(this.data.id)
          tmp.waren_eingang_product = this.data;

        products.push(tmp);
      }

    }
    return products;
  }
  getEuroPrice(price: number) {
    if(this.wareneingang === undefined || this.wareneingang === null ||  this.wareneingang.data === null)
      return -1;

    if(this.wareneingang.data.wahrung === this.wareneingang.data.wahrung2 )
      return price;

    return price * this.wareneingang.data.wahrung_rate;
  }
  priceChanged(index: number) {
    const tmp = this.product_variation.getRawValue()[index];
    if(tmp.price > 0 && tmp.quanity > 0) {
      tmp.price_in_euro = this.getEuroPrice(tmp.price);
      this.product_variation.controls[index].patchValue(tmp);
    }
  }
}
