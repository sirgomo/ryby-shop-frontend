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

    let itemGroup : iEbayInventoryItem | iEbayGroupItem;
    if(!this.group.groupIds || this.group.groupIds[0].split('/')[0] === 'null') {
      itemGroup  = await firstValueFrom(this.inventoryService.getInventoryItemBySku(this.group.sku));
    } else {
      itemGroup = await firstValueFrom(this.inventoryService.getInventoryItemGroup(this.group.groupIds![0]));
    }



    if(itemGroup && this.isEbayInvntoryItem(itemGroup)) {
      await this.ebayGroup(iProduct, itemGroup);
     this.openDialog(iProduct);
    } else {
      await this.ebayInvntoryItem(iProduct, itemGroup);
      this.openDialog(iProduct);
    }
  }
  private async ebayGroup(iProduct: iProduct, itemGroup: iEbayGroupItem) {
    iProduct.artid = this.getRandomArtikelId();
    iProduct.beschreibung = itemGroup.description;
    iProduct.datumHinzugefuegt = new Date(Date.now()).toISOString();
    iProduct.ebay = 1;
    iProduct.mehrwehrsteuer = 0;
    iProduct.variations = [];
    iProduct.name = itemGroup.title;
    iProduct.sku = this.group.groupIds![0];
    iProduct.produkt_image = itemGroup.imageUrls[0];
    if(Object(itemGroup.aspects).Modell)
    iProduct.product_sup_id = Object(itemGroup.aspects).Modell[0];


    if (itemGroup.variantSKUs)
      for (let i = 0; i < itemGroup.variantSKUs.length; i++) {
    if(itemGroup.variantSKUs[i]) {
      const offerP = await firstValueFrom(this.offerService.getOffersBeiSku(itemGroup.variantSKUs[i]));
        const offer = await firstValueFrom(this.inventoryService.getInventoryItemBySku(itemGroup.variantSKUs[i]));
        const variation: iProduktVariations = {} as iProduktVariations;

        if (offer.product && offer.product.imageUrls)
          variation.image = offer.product.imageUrls[0];
        else if(itemGroup.imageUrls[0])
        variation.image = itemGroup.imageUrls[0];

        variation.price = Number(offerP.offers[0].pricingSummary.price.value);
        variation.sku = offerP.offers[0].sku;
        if (offer.product && offer.product.aspects)
          variation.variations_name = Object.keys((offer.product.aspects))[0];
        if (offer.product && offer.product.aspects)
          variation.value = Object.values(offer.product.aspects)[0];
        if (Object(itemGroup.aspects).Gewicht)
          variation.unit = Object(itemGroup.aspects).Gewicht;

        iProduct.variations.push(variation);
        }
      }
  }
  private async ebayInvntoryItem(iProduct: iProduct, itemGroup: iEbayInventoryItem) {
    iProduct.artid = this.getRandomArtikelId();
      if(!itemGroup.sku)
        return;

        const offerP = await firstValueFrom(this.offerService.getOffersBeiSku(itemGroup.sku));
        if(itemGroup.product && Object(itemGroup.product.aspects).Modell)
        iProduct.product_sup_id = Object(itemGroup.product.aspects).Modell[0];


        iProduct.beschreibung =  offerP.offers[0].listingDescription;
        iProduct.datumHinzugefuegt = new Date(Date.now()).toISOString();
        iProduct.ebay = 1;
        iProduct.mehrwehrsteuer = 0;
        iProduct.variations = [];
        iProduct.name = itemGroup.product?.title ? itemGroup.product.title : 'No title';
        iProduct.sku = itemGroup.sku!;
        const offer = itemGroup;
        const variation: iProduktVariations = {} as iProduktVariations;
        if (offer.product && offer.product.imageUrls)
          variation.image = offer.product.imageUrls[0];
        variation.price = Number(offerP.offers[0].pricingSummary.price.value);
        variation.sku = offerP.offers[0].sku;
        if (offer.product && offer.product.aspects)
          variation.variations_name = Object.keys((offer.product.aspects))[0];
        if (offer.product && offer.product.aspects)
          variation.value = Object.values(offer.product.aspects)[0];
        if (itemGroup.product && Object(itemGroup.product.aspects).Gewicht)
          variation.unit = Object(itemGroup.product.aspects).Gewicht;

        iProduct.variations.push(variation);

  }

  isEbayInvntoryItem(item: any) : item is iEbayGroupItem {
    return 'description' in item;
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
