import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HelperService } from '../helper/helper.service';
import { iProduct } from '../model/iProduct';
import { iColor } from '../model/iColor';
import { CompanyService } from '../admin/company/company.service';
import { iCompany } from '../model/iCompany';
import { Observable, map, tap } from 'rxjs';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent implements OnInit {

  products = this.helper.cardSig;
  colors: iColor[][] = [];
  company = {} as iCompany;
  act$ = new Observable();
  showShippingAddress = false;
  columns: string[] = ['artid', 'name', 'color', 'toTmenge', 'priceSt', 'mwst', 'totalPrice', 'remove'];
    constructor (private readonly helper: HelperService, private companyService: CompanyService) {}
  ngOnInit(): void {
    this.reloadColors(this.products());
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
      this.colors.push(JSON.parse(arr[i].color));
    }
  }

  increaseQuantity(itemIndex: number, colorIndex: number) {
    this.colors[itemIndex][colorIndex].menge += 1;
    this.products()[itemIndex].color = JSON.stringify(this.colors[itemIndex]);
  }
  decreaseQuantity(itemIndex: number, colorIndex: number) {
    this.colors[itemIndex][colorIndex].menge -= 1;
    if(this.colors[itemIndex][colorIndex].menge  === 0) {
      this.colors[itemIndex].splice(colorIndex, 1);
      if(this.colors[itemIndex].length === 0)
      this.removeItem(itemIndex);
      return;
    }
    this.products()[itemIndex].color = JSON.stringify(this.colors[itemIndex]);
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
      return;
    }
    const newTab = tmp.slice(0);
    this.reloadColors(newTab);
    this.helper.cardSig.set(newTab);

  }
  getTotalPrice(itemIndex: number) {
    if(!this.products()[itemIndex])
    return;

        const colors: iColor[] = JSON.parse( this.products()[itemIndex].color);
        let total = 0;
        for (let i = 0; i < colors.length; i++) {
          let price = Number(this.products()[itemIndex].preis);
          if(this.products()[itemIndex].mehrwehrsteuer > 0 )
          {
            price += (price * this.products()[itemIndex].mehrwehrsteuer / 100);
          }
           total += price * colors[i].menge;
        }
        return total.toFixed(2);

  }
  getPricePerSt(itemIndex: number) {
    if(!this.products()[itemIndex])
    return;

    return Number(this.products()[itemIndex].preis);
  }
  getProduktMwst(itemIndex: number) {
    if(!this.products()[itemIndex])
    return;

    if(this.products()[itemIndex].mehrwehrsteuer === 0)
    return 0;

    return (Number(this.products()[itemIndex].preis) * this.products()[itemIndex].mehrwehrsteuer / 100).toFixed(2);
  }
  getProductMenge(itemIndex: number) {

    if(!this.products()[itemIndex])
    return;

    const color: iColor[] = JSON.parse(this.products()[itemIndex].color);

    let menge = 0;
    for (let i = 0; i< color.length; i++) {
       menge += color[i].menge;
    }
    return menge;
  }
  getTotalCount() {
    if(!this.products())
    return;

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
      const color: iColor[] = JSON.parse(items[i].color);
      for (let y = 0; y < color.length; y++ ) {
        price += color[y].menge * Number(items[i].preis);
      }
    }
    return price.toFixed(2);
  }
  getTotalMwst() {
    let mwst = 0;
    const items = this.products();
    for (let i = 0; i < items.length; i++) {
      const color: iColor[] = JSON.parse(items[i].color);
      for (let y = 0; y < color.length; y++ ) {
        mwst += (Number(items[i].preis) * items[i].mehrwehrsteuer / 100) * color[y].menge;
      }
    }
    return mwst.toFixed(2);
  }
  getTotalBrutto() {
    return (Number(this.getTotalPriceNetto()) + Number(this.getTotalMwst())).toFixed(2);
  }
  getLoginWindow() {
    this.helper.getLoginWindow();
    this.showShippingAddress = true;
  }
}
