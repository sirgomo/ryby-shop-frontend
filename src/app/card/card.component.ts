import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
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
import { IShippingCost } from '../model/iShippingCost';


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatProgressSpinnerModule, ShippingAddressComponent, MatSelectModule, MatTableModule, MatIconModule, CommonModule, MatButtonModule]
})
export class CardComponent implements OnInit, OnDestroy {

  products = this.helper.cardSig;
  company = {} as iCompany;
  act$ = new Observable();


  columns: string[] = ['sku', 'name', 'color', 'toTmenge', 'priceSt', 'mwst', 'totalPrice', 'remove'];
    constructor (public readonly helper: HelperService, private companyService: CompanyService) {}
  ngOnDestroy(): void {
    this.helper.selectedVersandMethod = {} as IShippingCost;
  }
  ngOnInit(): void {

    this.act$ = this.companyService.getCompanyById(1).pipe(map((res) => {
      this.setInitialVersandKosten();
      this.company = res;
      if(res && res.isKleinUnternehmen === 1)
      this.columns = ['sku', 'name', 'color', 'toTmenge', 'priceSt', 'totalPrice', 'remove'];

      if(!res)
        this.company = { isKleinUnternehmen: 0 } as iCompany;

        return this.company;
    }))
  }
  setInitialVersandKosten() {
    for (let i = 0; i < this.products().length; i++) {
      for(let j = 0; j < this.products()[i].shipping_costs.length; j++) {
        if(this.products()[i].shipping_costs[j].shipping_price > this.helper.versandAndKost()[this.helper.versandAndKost().length -1].shipping_price) {
          this.helper.versandAndKost().push(this.products()[i].shipping_costs[j]);
        }
      }
    }
  }



  increaseQuantity(index: number) {
    this.products()[index].variations[0].quanity +=1;
  }
  decreaseQuantity(index: number) {
    if(this.products()[index].variations[0].quanity === 1) {
      const quanity = this.helper.cardSigForMengeControl();
      quanity.splice(index, 1);
      const newquanity = quanity.slice(0);
      this.helper.cardSigForMengeControl.set(newquanity);
      const items = this.products();
      items.splice(index, 1);
      const newtab = items.slice(0);
      this.helper.cardSig.set(newtab);
      return;
    }


    this.products()[index].variations[0].quanity -=1;
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
    this.helper.cardSig.set(newTab);
    const controlItems = this.helper.cardSigForMengeControl().slice(0);
    controlItems.splice(itemIndex,1);
    this.helper.cardSigForMengeControl.set(controlItems);
    this.getTotalCount();
  }
  getTotalPrice(itemIndex: number) {
    if(!this.products()[itemIndex])
    return 0;


        let total = 0;

          let price = this.getPicePriceWithActions(this.products()[itemIndex]);
          if(this.products()[itemIndex].mehrwehrsteuer > 0 )
          {
            price += (price * this.products()[itemIndex].mehrwehrsteuer / 100);
          }
           total += price * this.products()[itemIndex].variations[0].quanity;

        return total.toFixed(2);

  }
  getPicePriceWithActions(item: iProduct) {
    let price = 0;
    price = Number(item.variations[0].price);
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

  getTotalCount() {
    if(!this.products() || this.products().length === 0)
    return 0;

    let count = 0;
    for (let i = 0; i < this.products().length; i++) {
      count += this.products()[i].variations[0].quanity;
    }

    return count;
  }
  getTotalPriceNetto() {
    let price = 0;

    for (let i = 0; i < this.products().length; i++) {
      price += Number(this.getTotalPrice(i));
    }
    return price.toFixed(2);
  }
  getTotalMwst() {
    let mwst = 0;
    const items = this.products();
    for (let i = 0; i < items.length; i++) {

      mwst += Number(this.getProduktMwst(i));
    }
    return mwst.toFixed(2);
  }
  getTotalBrutto() {
    return (Number(this.getTotalPriceNetto()) + Number(this.getTotalMwst())).toFixed(2);
  }
  setVersandKosten(value: IShippingCost) {
    this.helper.selectedVersandMethod = value;
  }
  doWeHaveEnough(index: number) :boolean {
    if(this.products().length === 0)
      return false;
    if(!this.helper.cardSigForMengeControl()[index])
      return false;

    const item = this.helper.cardSigForMengeControl()[index];
    const itindex = item.variations.findIndex((tmp) => tmp.sku === this.products()[index].variations[0].sku);

    if(itindex === -1)
      return false;

    let totalQuanityInAllProduct = 0;
    for (let i = 0; i < this.products().length; i++) {
        if(this.products()[i].variations[0].sku === item.variations[itindex].sku)
        totalQuanityInAllProduct += this.products()[i].variations[0].quanity;
    }
    return item.variations[itindex].quanity > totalQuanityInAllProduct;

  }
  getTotalPriceWithShipping() {
    if(this.products().length === 0)
    return 0;

    return (Number(this.getTotalBrutto()) + Number(this.helper.selectedVersandMethod.shipping_price)).toFixed(2);
  }
}
