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
import { iEbayCreateOffer } from 'src/app/model/ebay/item/iEbayCreateOffer';
import { MatIconModule } from '@angular/material/icon';
import { lastValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-ebay-variations',
  standalone: true,
  imports: [MatDialogModule, EbayImageComponent, MatButtonModule, MatSelectModule, MatFormFieldModule, SelectedVariationListComponent, MatIconModule],
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
  currentImageLinkSig = signal<string>('');
  locationKeySig = signal('');
  variationStartSig = signal(0);
  variationStopSig = signal(0);
  offersSig: WritableSignal<iEbayCreateOffer[]> = signal<iEbayCreateOffer[]>([]);
  
  groupItem: iEbayGroupItem;
  group_imageSig :WritableSignal<string[]> = signal([]);
    constructor(private readonly inventoryService: EbayInventoryService, 
      @Inject(MAT_DIALOG_DATA) public data: [iProduct | iEbayInventoryItem[], iSelectedAspects, iEbayGroupItem, iEbayCreateOffer[]],
      private sanitizer: DomSanitizer,
      private readonly snackBar: MatSnackBar
    ) {
      this.groupItem = this.data[2];
      this.variations_nameSig().push('Group');
      this.currentVariationsSig.set('Group');
      this.setImageForGroupOrVariation();
      this.offersSig.set(this.data[3]);
      //item is on ebay
      if (this.data[0] && this.isTypeEbayInventoryItem(this.data[0])) {
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
              imageUrls: [],
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

  isTypeEbayInventoryItem(obj : any ) : obj is iProduktVariations {
    if(!obj[0])
      return false;


    return 'product' in obj[0];
  }
  getSafeImageData() {
    if (this.currentImageSig()) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.currentImageSig() as Blob));
    }
    return '';
  }

  setImageForGroupOrVariation(sku? : string) {
    const img = Array(12).fill('');
    //group item its start item
    if (this.currentVariationsSig() === 'Group') {
      this.variationStartSig.set(0);
      this.variationStopSig.set(0);
      for (let i = 0; i < 12; i++) {
        //set item sku for group
        this.currentSku = this.groupItem.inventoryItemGroupKey;
        if(this.groupItem && this.groupItem.imageUrls && this.groupItem.imageUrls[i])
          img[i] = this.groupItem.imageUrls[i];
      }
      this.group_imageSig.set(img);
      const firstLinkIndex = this.group_imageSig().findIndex((tmp) => tmp !== '');
      if (firstLinkIndex !== -1 ) {
        this.currentImageLinkSig.set(this.group_imageSig()[firstLinkIndex]!);
        lastValueFrom(this.inventoryService.getImageFromEbay(this.group_imageSig()[firstLinkIndex]!)).then((res) => {
          if(Object(res).message)
            this.snackBar.open(Object(res).message, 'Ok', { duration: 3000 });
          else
            this.currentImageSig.set(res as Blob);
        })
      }
      
      //current varation selected, is not group item
    } else {
      const index = this.groupItem.variesBy.specifications.findIndex((item) => item.name === this.currentVariationsSig());
      if (index === -1) {
        this.variationStartSig.set(0);
        this.variationStopSig.set(0);
        return;
      }
        let start = 0;
        let end = 0;
      for (let i = 0; i < this.groupItem.variesBy.specifications.length; i++) {
        if(i < index)
          start += this.groupItem.variesBy.specifications[i].values.length;

        if ( i === index) {
          start = i;
          end = i + this.groupItem.variesBy.specifications[i].values.length;
        }
      }
      this.variationStartSig.set(start);
      this.variationStopSig.set(end);
      //set item sku for first element
      this.currentSku = sku ? sku :  this.variationsSig()[start].sku!;
      this.variationsSig().forEach((item) => {
        if (item.sku === this.currentSku) {
         
          for (let i = 0; i < 12; i++) {
       
            if (item.product && item.product.imageUrls && item.product.imageUrls[i]) {
              img[i] = item.product.imageUrls[i];
              if (i === 0 && img[0] !== '') {
                lastValueFrom(this.inventoryService.getImageFromEbay(img[0]!)).then((res) => {
                  if(!Object(res).message)
                    this.snackBar.open(Object(res).message, 'Ok', { duration: 3000 });
                  else {
                    this.currentImageSig.set(res as Blob);
                    this.currentImageLinkSig.set(item.product!.imageUrls![i]);
                  }
                });
              }
                
            }
              

          }
        }
      });

      this.group_imageSig.set(img);
      if(this.group_imageSig()[0] === '') {
        this.currentImageSig.set(undefined);
        this.currentImageLinkSig.set('');
      }
       

    }

  }
  setImageForVariation(sku: string) {
    this.setImageForGroupOrVariation(sku);
  }
  setImageLink(image :{link: string, image: Blob, upload: boolean, index: number}) {
    if(image.upload) {
      console.log('link ' + image.link + '\n' + ' current sku ' + this.currentSku);
      this.currentImageSig.set(image.image);
      this.currentImageLinkSig.set(image.link);
      let variationItem = false;
      this.variationsSig().forEach((item) => {
        if (item.sku === this.currentSku) {
          if (item.product) {
            if (!item.product.imageUrls) {
                item.product.imageUrls = [];
            }
              

            item.product.imageUrls[image.index] = image.link;        
            this.setImageForVariation(this.currentSku);
            variationItem = true;
          }
        }
      });
      if(!variationItem) {
        if(!this.groupItem.imageUrls)
          this.groupItem.imageUrls = [];

        this.groupItem.imageUrls[image.index] = image.link;
        this.setImageForVariation(this.currentSku);
      }
    } else {
      this.currentImageSig.set(image.image);
      this.currentImageLinkSig.set(image.link);
    }

    
  }
  deleteImageOn(index: number) {
    console.log(index);
    this.group_imageSig()[index] = '';
    let isVariation = false;
    this.variationsSig().forEach((item) => {
      if(item.sku === this.currentSku && item.product?.imageUrls) {
        if(this.currentImageLinkSig() === item.product.imageUrls[index]) {
          this.currentImageLinkSig.set('');
          this.currentImageSig.set(undefined);
          isVariation = true;
        }
          


        item.product.imageUrls[index] = '';
      }
        
    })
    if(!isVariation && this.currentSku === this.groupItem.inventoryItemGroupKey) {
        if(this.currentImageLinkSig() === this.groupItem.imageUrls[index]) {
          this.currentImageLinkSig.set('');
          this.currentImageSig.set(undefined);
          this.groupItem.imageUrls[index] = '';
        }
          
    }
  }
}
