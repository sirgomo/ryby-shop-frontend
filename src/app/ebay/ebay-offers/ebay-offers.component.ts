import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { iEbayInventoryItem } from 'src/app/model/ebay/iEbayInventoryItem';
import { EbayOffersService } from '../ebay-offers.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ErrorComponent } from 'src/app/error/error.component';
import { ErrorService } from 'src/app/error/error.service';
import { MatIconModule } from '@angular/material/icon';
import { EbayInventoryService } from '../ebay-inventory/ebay-inventory.service';
import { firstValueFrom } from 'rxjs';
import { iEbayGroupItem } from 'src/app/model/ebay/iEbayGroupItem';
import { iProduct } from 'src/app/model/iProduct';
import { iProduktVariations } from 'src/app/model/iProduktVariations';
import { environment } from 'src/environments/environment';
import { AddEditProductComponent } from 'src/app/admin/add-edit-product/add-edit-product.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-ebay-offers',
  standalone: true,
  imports: [CommonModule, ErrorComponent, MatIconModule, AddEditProductComponent, MatProgressSpinnerModule],
  templateUrl: './ebay-offers.component.html',
  styleUrls: ['./ebay-offers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EbayOffersComponent implements OnInit{

  constructor(private readonly offerService: EbayOffersService, @Optional() @Inject(MAT_DIALOG_DATA) private group: iEbayInventoryItem,
  public errMessage: ErrorService, private dialRef: MatDialogRef<EbayOffersComponent>, private readonly inventoryService: EbayInventoryService, private dialog: MatDialog) {}

  ngOnInit(): void {
     this.getOffers();
  }
  close() {
    this.dialRef.close();
  }
  async getOffers() {
    const iProduct: iProduct = {} as iProduct;
    const itemGroup: iEbayGroupItem = await firstValueFrom(this.inventoryService.getInventoryItemGroup(this.group.groupIds![0]));
    if(itemGroup) {
      iProduct.artid = this.getRandomArtikelId();
      iProduct.beschreibung = itemGroup.description;
      iProduct.datumHinzugefuegt = new Date(Date.now()).toISOString();
      iProduct.ebay = 1;
      iProduct.mehrwehrsteuer = 0;
      iProduct.variations = [];
      iProduct.name = itemGroup.title;
      iProduct.sku = this.group.groupIds![0];


      if(itemGroup.variantSKUs)
      for(let i = 0; i < itemGroup.variantSKUs.length; i++) {
        const offerP = await firstValueFrom(this.offerService.getOffersBeiSku(itemGroup.variantSKUs[i]));
        const offer = await firstValueFrom(this.inventoryService.getInventoryItemBySku(itemGroup.variantSKUs[i]));
          const variation: iProduktVariations = {} as iProduktVariations;
            if(offer.product && offer.product.imageUrls)
            variation.image = offer.product.imageUrls[0];
            variation.price = Number(offerP.offers[0].pricingSummary.price.value);
            variation.sku = offerP.offers[0].sku;
            if(offer.product && offer.product.aspects)
            variation.variations_name = Object.keys((offer.product.aspects))[0]
            if(offer.product && offer.product.aspects)
            variation.value = Object.values(offer.product.aspects)[0];
            if(Object(itemGroup.aspects).Gewicht)
            variation.unit = Object(itemGroup.aspects).Gewicht;


          iProduct.variations.push(variation);
      }

     this.openDialog(iProduct);
    }
  }
  openDialog(iProduct: iProduct) {
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.width = '100%';
    conf.height = '100%';
    conf.data = iProduct;

    this.dialog.open(AddEditProductComponent, conf);
    this.dialRef.close();
  }

   getRandomArtikelId(): number {
    let artid = '';
    const sequence = '1234567890';
    for (let i = 0; i < environment.artidlength; i++) {
      artid += sequence[(Math.floor(Math.random() * sequence.length))];
    }
    return Number(artid);
  }
}
