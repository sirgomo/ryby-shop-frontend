import { Component, OnInit } from '@angular/core';
import { HelperService } from '../helper/helper.service';
import { iProduct } from '../model/iProduct';
import { iColor } from '../model/iColor';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
getTotalMenge(itemIndex: number) {
  const color: iColor[] = JSON.parse(this.products()[itemIndex].color);
  let menge = 0;
  for (let i = 0; i< color.length; i++) {
    menge += color[i].menge;
  }
  return menge;
}
  products = this.helper.cardSig;
  colors: iColor[][] = [];
  columns: string[] = ['artid', 'name', 'color', 'toTmenge', 'priceSt', 'mwst', 'totalPrice', 'remove'];
    constructor (private readonly helper: HelperService) {}
  ngOnInit(): void {
   for (let i = 0; i < this.products().length; i++) {
    this.colors.push(JSON.parse(this.products()[i].color))
   }
  }
  increaseQuantity(itemIndex: number, colorIndex: number) {
    this.colors[itemIndex][colorIndex].menge += 1;
    this.products()[itemIndex].color = JSON.stringify(this.colors[itemIndex]);
    console.log(this.products())
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
    console.log(this.products())
  }
  removeItem(itemIndex: number) {
    this.products().splice(itemIndex, 1);
  }
  getTotalPrice(itemIndex: number) {
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
    return Number(this.products()[itemIndex].preis);
  }
  getProduktMwst(itemIndex: number) {
    if(this.products()[itemIndex].mehrwehrsteuer === 0)
    return 0;

    return (Number(this.products()[itemIndex].preis) * this.products()[itemIndex].mehrwehrsteuer / 100).toFixed(2);
  }
}
