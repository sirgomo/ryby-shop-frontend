import { ChangeDetectionStrategy, Component, OnChanges, OnDestroy, OnInit, SimpleChanges, } from '@angular/core';
import { HelperService } from '../helper/helper.service';
import { iProduct } from '../model/iProduct';
import { CompanyService } from '../admin/company/company.service';
import { iCompany } from '../model/iCompany';
import { Observable, delay, firstValueFrom, lastValueFrom, map } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ShippingAddressComponent } from './shipping-address-make-bestellung/shipping-address.component';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { IShippingCost } from '../model/iShippingCost';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { AktionService } from '../aktion/aktion.service';
import { iAktion } from '../model/iAktion';




@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatProgressSpinnerModule, ShippingAddressComponent, MatSelectModule, MatTableModule, MatIconModule, CommonModule, MatButtonModule, MatInputModule,
  MatFormFieldModule, FormsModule]
})
export class CardComponent implements OnInit, OnDestroy, OnChanges {



  products = this.helper.cardSig;
  company = {} as iCompany;
  act$ = new Observable();
  promo = '';

  columns: string[] = ['sku', 'name', 'color', 'toTmenge', 'priceSt', 'mwst', 'totalPrice', 'remove'];
    constructor (public readonly helper: HelperService, private companyService: CompanyService, public readonly aktionService: AktionService) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.setInitialVersandKosten();
  }
  ngOnDestroy(): void {
    this.helper.selectedVersandMethod.set({ shipping_name: 'Selbstabholung', shipping_price: 0, average_material_price: 0, cost_per_added_stuck: 0 });
    this.helper.isShippingCostSelected.set(false);
    this.setInitialVersandKosten();
  }
  ngOnInit(): void {
    this.helper.selectedVersandMethod.set(null);
    this.helper.isShippingCostSelected.set(false);
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
      if(this.products()[i].shipping_costs)
      for(let j = 0; j < this.products()[i].shipping_costs.length; j++) {
          if(this.helper.versandAndKost().length === 1) {
            this.helper.versandAndKost().push(this.products()[i].shipping_costs[j]);
          }

          else if (this.products()[i].shipping_costs[j].shipping_price > this.helper.versandAndKost()[this.helper.versandAndKost().length -1].shipping_price ) {
            this.helper.versandAndKost()[this.helper.versandAndKost().length -1] = this.products()[i].shipping_costs[j];
          }
        }

    }
  }



  increaseQuantity(index: number) {
    this.products()[index].variations[0].quanity +=1;
    if(this.helper.selectedVersandMethod() !== null)
      this.helper.totalShippingCost.set(this.getShippingCost(this.helper.selectedVersandMethod()!.shipping_price));
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
      this.helper.selectedVersandMethod.set({ shipping_name: 'Selbstabholung', shipping_price: 0, average_material_price: 0, cost_per_added_stuck: 0 });
      this.helper.isShippingCostSelected.set(false);
      this.helper.totalShippingCost.set(0);
      return;
    }

    this.products()[index].variations[0].quanity -=1;
    if(this.products().length === 0)
      this.helper.selectedVersandMethod.set(null);

  if(this.helper.selectedVersandMethod() !== null)
    this.helper.totalShippingCost.set(this.getShippingCost(this.helper.selectedVersandMethod()!.shipping_price));
  }
  removeItem(itemIndex: number) {

    const tmp = this.products();
    tmp.splice(itemIndex, 1);
    if(tmp.length === 0) {
      this.products.set([]);
      this.helper.cardSig.set([]);
      this.helper.cardSigForMengeControl.set([]);
      this.getTotalCount();
      this.helper.selectedVersandMethod.set({ shipping_name: 'Selbstabholung', shipping_price: 0, average_material_price: 0, cost_per_added_stuck: 0 });
      this.helper.isShippingCostSelected.set(false);
      this.helper.totalShippingCost.set(0);
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
            price += Number((price * this.products()[itemIndex].mehrwehrsteuer / 100).toFixed(2));
          }
           total += price * this.products()[itemIndex].variations[0].quanity;

        return total.toFixed(2);

  }
  getPicePriceWithActions(item: iProduct) {
    let price = 0;
    price = Number(item.variations[0].price);
    if(item.promocje && item.promocje[0]) {
      price -= Number((price * item.promocje[0].rabattProzent / 100).toFixed(2));
    }

    return price;
  }
  getRabat(item: iProduct): number {
    let price = 0;
    price = Number(item.variations[0].price);
    return Number((price * item.promocje[0].rabattProzent / 100) .toFixed(2)) * item.variations[0].quanity;
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
    if(!this.products() || this.products().length < 1)
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
    this.helper.totalShippingCost.set(this.getShippingCost(value.shipping_price));
    this.helper.selectedVersandMethod.set(value);
    this.helper.isShippingCostSelected.set(true);
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
    if(this.helper.selectedVersandMethod() !== null)
     return (Number(this.getTotalBrutto()) + this.getShippingCost(this.helper.selectedVersandMethod()!.shipping_price)).toFixed(2);
    else
    return 0;
  }

  getShippingCost(arg0: number) {
    let pauschalecost = 0;

        for (let i = 0; i < this.products().length; i++) {
          if(this.getTotalCount() > 1) {
            if(this.products()[i].shipping_costs && i === 0 && this.products()[i].variations[0].quanity > 1)
            pauschalecost += Number(this.products()[i].shipping_costs[0].cost_per_added_stuck) * (Number(this.products()[i].variations[0].quanity - 1 ));
            if(this.products()[i].shipping_costs && i > 0)
            pauschalecost += Number(this.products()[i].shipping_costs[0].cost_per_added_stuck) * Number(this.products()[i].variations[0].quanity);
          }
        }

    //TODO Tax must also be charged on shipping too.
    return +arg0 + pauschalecost;
    }
   async setPromoCode() {
      if(this.promo.length >= 4) {
        await delay(500);
        this.getCode();
      }
  }
  getCode() {
    let firstProdId: number =  0;
    if (this.helper.cardSig()[0] && typeof this.helper.cardSig()[0].id === 'number') {
      firstProdId = this.helper.cardSig()[0].id!;
    }


    firstValueFrom(this.aktionService.getPromotionOnCode(this.promo, firstProdId)).then((res) => {
      if(this.isInstanceOfiAktion(res) && res.produkt.length > 0) {
        this.helper.cardSig.update((prod) => {
          const items = [];
          for (let i = 0; i < prod.length; i++) {
            prod[i].promocje = [res];
            items.push(prod[i]);
          }
          this.columns[this.columns.length-1] = 'rabat';
          this.columns.push('remove');
          return items;
        })
      }
    });

  }
  private isInstanceOfiAktion(obj: any) : obj is iAktion {
    return obj !== null && obj.produkt !== null;
  }
}
