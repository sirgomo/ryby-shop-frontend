import { ChangeDetectionStrategy, Component, Input, Signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { iEbayInventoryItem } from 'src/app/model/ebay/iEbayInventoryItem';
import { iEbayCreateOffer } from 'src/app/model/ebay/item/iEbayCreateOffer';

@Component({
  selector: 'app-selected-variation-list',
  standalone: true,
  imports: [MatTableModule, MatFormFieldModule, FormsModule, MatInputModule],
  templateUrl: './selected-variation-list.component.html',
  styleUrl: './selected-variation-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectedVariationListComponent {
  @Input('variationSig') variationSig!: WritableSignal<iEbayInventoryItem[]>;
  @Input('startSig') startSig!: Signal<number>;
  @Input('stopSig') stopSig!: Signal<number>;
  @Input('variation_nameSig') variation_nameSig!: Signal<string>;
  @Input('offersSig') offersSig!: WritableSignal<iEbayCreateOffer[]>  
  tabeleHead = ['sku', 'ean', 'variant_name', 'count', 'price'];

  getItems() {
    const tab = [];
    for(let i = 0; i < this.variationSig().length; i++) {

      if(i >= this.startSig() && i < this.stopSig() && this.stopSig() !== 0) {
        tab.push(this.variationSig()[i]);
      } else if (this.stopSig() === 0) {
          tab.push(this.variationSig()[i])
      }

    }
  return tab;
  }
  setNewPrice(sku: string, price: string) {
    if (price.length < 2)
      return;

    this.offersSig().filter((item) => item.sku === sku)[0].pricingSummary.price.value = price;
  }
  getPrice(sku: string) {
    return this.offersSig().filter((item) => item.sku === sku)[0].pricingSummary.price.value;
  }
} 
