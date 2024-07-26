import { ChangeDetectionStrategy, Component, Inject, Sanitizer, signal, WritableSignal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { EbayInventoryService } from 'src/app/ebay/ebay-inventory/ebay-inventory.service';
import { AvailabilityTypeEnum, ConditionEnum, iEbayInventoryItem, LocaleEnum } from 'src/app/model/ebay/iEbayInventoryItem';
import { iEbayGroupItem } from 'src/app/model/ebay/item/iEbayGroupItem';
import { iSelectedAspects } from 'src/app/model/ebay/item/iSelectedAspects';
import { iProduktVariations } from 'src/app/model/iProduktVariations';
import { EbayImageComponent } from '../ebay-image/ebay-image.component';
import { iProduct } from 'src/app/model/iProduct';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SelectedVariationListComponent } from '../selected-variation-list/selected-variation-list.component';


@Component({
  selector: 'app-ebay-variations',
  standalone: true,
  imports: [MatDialogModule, EbayImageComponent, MatButtonModule, MatSelectModule, MatFormFieldModule, SelectedVariationListComponent],
  templateUrl: './ebay-variations.component.html',
  styleUrl: './ebay-variations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EbayVariationsComponent {
  variationsSig: WritableSignal<iEbayInventoryItem[]> = signal<iEbayInventoryItem[]>([]);
  variations_nameSig: WritableSignal<string[]> = signal<string[]>([]);
  currentVariationsSig = signal('');
  currentSku = '';
  currentImageSig = signal<Blob | undefined>(undefined);
  locationKeySig = signal('');
  variationStart = signal(0);
  variationStop = signal(0);
  
  groupItem: iEbayGroupItem;
  group_imageSig :WritableSignal<string[] | undefined []> = signal([]);
    constructor(private readonly inventoryService: EbayInventoryService, @Inject(MAT_DIALOG_DATA) public data: [iProduct | iEbayInventoryItem[], iSelectedAspects, iEbayGroupItem],
  private sanitizer: DomSanitizer) {
      this.groupItem = this.data[2];
      this.variations_nameSig().push('Group');
      this.currentVariationsSig.set('Group');
      this.setImageForGroupOrVariation();
      //item is on ebay
      if (this.data[0] && this.isType(this.data[0])) {
        const tmp = this.data[0] as iEbayInventoryItem[];
        this.variationsSig.set(tmp);
        this.groupItem.variesBy.aspectsImageVariesBy.forEach((item) => {
          this.variations_nameSig().push(item);
        });
       
        //item is not yet on ebay
      } else {
        Object(this.data[0]).variations.forEach((tmp: any) => {
          const tmp2: iProduktVariations = {} as iProduktVariations;
          Object.assign(tmp2, tmp);
          const item : iEbayInventoryItem = {} as iEbayInventoryItem;
            item.availability = {
              shipToLocationAvailability : {
                quantity: tmp2.quanity,
              },
              pickupAtLocationAvailability: [{
                availabilityType: AvailabilityTypeEnum.IN_STOCK,
                quantity: tmp2.quanity,
                merchantLocationKey: this.locationKeySig(),
              }],
              
            }
            item.sku = tmp2.sku;
            item.locale = LocaleEnum.de_DE;
            item.condition = ConditionEnum.NEW;
            item.product = {
              aspects: this.data[1] ? this.data[1].aspects as string: undefined,
              description: Object(this.data[0]).beschreibung,
              imageUrls: [''],
              title:  Object(this.data[0]).name,
            }
            if(!this.groupItem.variantSKUs)
              this.groupItem.variantSKUs = [];

            this.groupItem.variantSKUs.push(item.sku);
            this.variationsSig().push(item);

            this.loadVariationsImage(tmp2);
        });
       
      }  
      console.log(this.groupItem);    
    }

  private loadVariationsImage(tmp2: iProduktVariations) {
    if (!this.groupItem?.variesBy?.aspectsImageVariesBy || this.groupItem.variesBy.aspectsImageVariesBy.length === 0) {
      this.groupItem.variesBy = {
        aspectsImageVariesBy: [],
        specifications: [],
      };
      this.groupItem.variesBy.aspectsImageVariesBy.push(tmp2.variations_name);
      this.groupItem.variesBy.specifications.push({ name: tmp2.variations_name, values: [tmp2.value] });
    } else {
      const name = this.groupItem.variesBy.aspectsImageVariesBy.findIndex((item) => item === tmp2.variations_name);

      if (name !== -1)
        this.groupItem.variesBy.specifications[name].values.push(tmp2.value);

      if (name === -1) {
        this.groupItem.variesBy.aspectsImageVariesBy.push(tmp2.variations_name);
        this.groupItem.variesBy.specifications.push({ name: tmp2.variations_name, values: [tmp2.value] });
      }
    }
    this.groupItem.variesBy.aspectsImageVariesBy.forEach((item) => {
      if(this.variations_nameSig().findIndex((tmp) => item === tmp) === -1)
         this.variations_nameSig().push(item);
    });
  }

    isType(obj : any ) : obj is iProduktVariations {
      return 'product' in obj;
    }
    getSafeImageData() {
      if (this.currentImageSig()) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.currentImageSig() as Blob));
      }
      return '';
    }
    setCurrentImage(image: Blob) {
      this.currentImageSig.set(image);
    }
  setImageForGroupOrVariation() {
    console.log(this.currentVariationsSig());
    if(this.currentVariationsSig() === 'Group') {
      this.variationStart.set(0);
      this.variationStop.set(0);
      for (let i = 0; i < 12; i++) {
        this.group_imageSig()[i] = undefined;
        //set item sku for group
        this.currentSku = this.data[2].inventoryItemGroupKey;
        if(this.groupItem && this.groupItem.imageUrls && this.groupItem.imageUrls[i])
          this.group_imageSig()[i] = this.groupItem.imageUrls[i];
      }
    } else {
      const index = this.groupItem.variesBy.specifications.findIndex((item) => item.name === this.currentVariationsSig());
      if(index === -1) {
        this.variationStart.set(0);
        this.variationStop.set(0);
        return;
      }
       let start = 0;
       let end = 0;
      for(let i = 0; i < this.groupItem.variesBy.specifications.length; i++) {
        if(i < index)
          start += this.groupItem.variesBy.specifications[i].values.length;

        if ( i === index) {
          start = i;
          end = i + this.groupItem.variesBy.specifications[i].values.length;
        }
      }
      this.variationStart.set(start);
      this.variationStop.set(end);
      //set item sku for first element
      this.currentSku = this.variationsSig()[start].sku!;
    }

  }
  setImageForVariation(sku: string) {
    const index = this.variationsSig().findIndex((item) => item.sku === sku);
    if(index === -1) 
      return;

    const images = this.variationsSig()[index].product?.imageUrls;

    if(!images)
      return;

    console.log('images sa ' + sku);
    for (let i = 0; i < 12; i++) {
      this.group_imageSig()[i] = undefined;
      
   
      if(images[i])
        this.group_imageSig()[i] = images[i];
    }
    this.currentSku = sku;
  }
  setImageLink(link: string) {
    console.log('link ' + link + '\n' + ' current sku ' + this.currentSku);
  }
}
