import { ChangeDetectionStrategy, Component, OnInit, computed, signal } from '@angular/core';
import { HelperService } from '../helper/helper.service';
import { iProduct } from '../model/iProduct';
import { CompanyService } from '../admin/company/company.service';
import { iCompany } from '../model/iCompany';
import { Observable, map, tap } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ShippingAddressComponent } from './shipping-address-make-bestellung/shipping-address.component';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatProgressSpinnerModule, ShippingAddressComponent, MatSelectModule, MatTableModule, MatIconModule, CommonModule, MatButtonModule]
})
export class CardComponent implements OnInit {

  products = this.helper.cardSig;
  colors: any[][] = [];
  company = {} as iCompany;
  act$ = new Observable();

  totalPrice = computed(() => {
    return (Number(this.getTotalBrutto()) + Number(this.helper.VersandAndKost().split('|')[1])).toFixed(2);
  })
  columns: string[] = ['artid', 'name', 'color', 'toTmenge', 'priceSt', 'mwst', 'totalPrice', 'remove'];
    constructor (private readonly helper: HelperService, private companyService: CompanyService) {}
  ngOnInit(): void {
    this.reloadColors(this.products());
    this.helper.VersandAndKost.set('0|0');
    this.act$ = this.companyService.getCompanyById(1).pipe(map((res) => {
      this.company = res;
      if(res && res.isKleinUnternehmen === 1)
      this.columns = ['artid', 'name', 'color', 'toTmenge', 'priceSt', 'totalPrice', 'remove'];

      if(!res)
        this.company = { isKleinUnternehmen: 0 } as iCompany;

        return this.company;
    }))
  }


  private reloadColors(arr: iProduct[]) {

    this.colors = [];
    for (let i = 0; i < arr.length; i++) {


    }
  }

  increaseQuantity(itemIndex: number, colorIndex: number) {
    this.colors[itemIndex][colorIndex].menge += 1;
    //this.products()[itemIndex].color = JSON.stringify(this.colors[itemIndex]);
    const tmp = this.products();
    const newT = tmp.slice();
    this.reloadColors(newT);
    this.helper.cardSig.set(newT);
  }
  decreaseQuantity(itemIndex: number, colorIndex: number) {
    this.colors[itemIndex][colorIndex].menge -= 1;
    if(this.colors[itemIndex][colorIndex].menge  === 0) {
      this.colors[itemIndex].splice(colorIndex, 1);
      if(this.colors[itemIndex].length === 0) {
        this.removeItem(itemIndex);
        return;
      }
    }
   // this.products()[itemIndex].color = JSON.stringify(this.colors[itemIndex]);

    const tmp = this.products();
    const newT = tmp.slice();
    this.reloadColors(newT);
    this.helper.cardSig.set(newT);

  }
  removeItem(itemIndex: number) {

    const tmp = this.products();
    tmp.splice(itemIndex, 1);
    if(tmp.length === 0) {
      this.products.set([]);
      this.helper.cardSig.set([]);
      this.helper.cardSigForMengeControl.set([]);
      this.getTotalCount();
      return;
    }
    const newTab = tmp.slice(0);
    this.reloadColors(newTab);
    this.helper.cardSig.set(newTab);
    const controlItems = this.helper.cardSigForMengeControl().slice(0);
    controlItems.splice(itemIndex,1);
    this.helper.cardSigForMengeControl.set(controlItems);
    this.getTotalCount();
  }
  getTotalPrice(itemIndex: number) {
    if(!this.products()[itemIndex])
    return;

        const colors: any = 0// JSON.parse( this.products()[itemIndex].color);
        let total = 0;
        for (let i = 0; i < colors.length; i++) {
          let price = this.getPicePriceWithActions(this.products()[itemIndex]);
          if(this.products()[itemIndex].mehrwehrsteuer > 0 )
          {
            price += (price * this.products()[itemIndex].mehrwehrsteuer / 100);
          }
           total += price * colors[i].menge;
        }
        return total.toFixed(2);

  }
  getPicePriceWithActions(item: iProduct) {
    let price = 0;
    price = 0// Number(item.price);
    if(item.promocje && item.promocje[0]) {
      price -= price * item.promocje[0].rabattProzent / 100;
    }

    return price;
  }
  getPricePerSt(itemIndex: number) {
    if(!this.products()[itemIndex])
    return;

    return this.getPicePriceWithActions(this.products()[itemIndex]);
  }
  getProduktMwst(itemIndex: number) {
    if(!this.products()[itemIndex])
    return;

    if(this.products()[itemIndex].mehrwehrsteuer === 0)
    return 0;

    return (this.getPicePriceWithActions(this.products()[itemIndex]) * this.products()[itemIndex].mehrwehrsteuer / 100).toFixed(2);
  }
  getProductMenge(itemIndex: number) {

    if(!this.products()[itemIndex])
    return;

    const color: any = 0 //JSON.parse(this.products()[itemIndex].color);

    let menge = 0;
    for (let i = 0; i< color.length; i++) {
       menge += color[i].menge;
    }
    return menge;
  }
  getTotalCount() {
    if(!this.products() || this.products().length === 0)
    return 0;

    let count = 0;
    for (let i = 0; i < this.colors.length; i++ ) {
      if(this.colors[i].length > 0)
      for (let y = 0; y < this.colors[i].length; y++) {
        if(this.colors[i][y])
          count += this.colors[i][y].menge;
      }
    }
    return count;
  }
  getTotalPriceNetto() {
    let price = 0;
    const items = this.products();
    for (let i = 0; i < items.length; i++) {

    }
    return price.toFixed(2);
  }
  getTotalMwst() {
    let mwst = 0;
    const items = this.products();
    for (let i = 0; i < items.length; i++) {

    }
    return mwst.toFixed(2);
  }
  getTotalBrutto() {
    return (Number(this.getTotalPriceNetto()) + Number(this.getTotalMwst())).toFixed(2);
  }
  setVersandKosten(value: string) {
    this.helper.VersandAndKost.set(value);
  }
  doWeHaveEnough(itemIndex: number, colorIndex: number) :boolean {
    const colorBuy: any = 0//JSON.parse(this.helper.cardSig()[itemIndex].color);
    const colorOrgi: any = 0//JSON.parse(this.helper.cardSigForMengeControl()[itemIndex].color);

    if(colorBuy.length === colorOrgi.length)
      return colorBuy[colorIndex].menge < colorOrgi[colorIndex].menge;


    return  false;

  }
}
