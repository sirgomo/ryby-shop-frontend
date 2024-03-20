import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { ErrorComponent } from 'src/app/error/error.component';
import { ErrorService } from 'src/app/error/error.service';
import { iProduct } from 'src/app/model/iProduct';
import { iProduktVariations } from 'src/app/model/iProduktVariations';
import { iWarenEingangProdVariation } from 'src/app/model/iWarenEingangProdVariation';

@Component({
  selector: 'app-sell-item',
  standalone: true,
  imports: [FormsModule, CommonModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatTableModule, MatIconModule, ErrorComponent],
  templateUrl: './sell-item.component.html',
  styleUrl: './sell-item.component.scss'
})
export class SellItemComponent {
    products: iProduct[] = [];
    products_variations : iProduktVariations[] = [];
    incomming_product_variations: iWarenEingangProdVariation[] = [];
    quanity: number[] = [];
    price: number[] = [];

    displayedColumns = ['sku', 'variations_name', 'quantity', 'price', 'acction'];
    constructor(@Inject(MAT_DIALOG_DATA) public product: iProduct, private dialRef: MatDialogRef<SellItemComponent>, public errorService: ErrorService) {

      this.product.wareneingang.forEach((item) => {
        item.product_variation.forEach((variation) => {
          if(this.incomming_product_variations.length === 0)
            this.incomming_product_variations.push(variation);
          else {
            const index = this.incomming_product_variations.findIndex((tmp) => tmp.sku === variation.sku);

            if (index === -1)
              this.incomming_product_variations.push(variation);
          }

        })
      })
      this.product.variations.forEach((item) => {
        const index = this.incomming_product_variations.findIndex((tmp) => tmp.sku === item.sku);

        if(index !== -1) {
          this.products_variations.push(item);
          this.quanity.push(0)
          this.price.push(item.price);
        }

      })
    }

    abort() {
      this.dialRef.close(null);
    }
    addItem(index: number) {
      const item = {
        ...this.products_variations[index],
        quanity: this.quanity[index],
        price: this.price[index],
      }
      const prod: iProduct = {} as iProduct;
      Object.assign(prod, this.product);
      prod.variations = [item];
      prod.wareneingang = [];
      this.products.push(prod);
    }
    save() {
      this.dialRef.close(this.products);
    }
    getItemPrice(item: iProduktVariations) {
      const index = this.incomming_product_variations.findIndex((tmp) => tmp.sku === item.sku);

      if (index === -1) {
        this.errorService.newMessage('Preis for item wurde nicht gefunden !')
        return 0;
      }


    const preis = Number(this.incomming_product_variations[index].price_in_euro) + (Number(this.incomming_product_variations[index].price_in_euro) * Number(this.product.mehrwehrsteuer) / 100)
    return preis.toFixed(2);
    }
}
