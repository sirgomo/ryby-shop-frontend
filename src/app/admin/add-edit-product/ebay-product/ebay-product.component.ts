import { ChangeDetectionStrategy, Component, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder,  FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { lastValueFrom } from 'rxjs';
import { EbayInventoryService } from 'src/app/ebay/ebay-inventory/ebay-inventory.service';
import { iEbayInventoryItem } from 'src/app/model/ebay/iEbayInventoryItem';
import { Category } from 'src/app/model/ebay/item/iEbayCategorySugestion';
import { iEbayCreateOffer } from 'src/app/model/ebay/item/iEbayCreateOffer';
import { iEbayGroupItem } from 'src/app/model/ebay/item/iEbayGroupItem';
import { iProduct } from 'src/app/model/iProduct';
import { EbayCategoryComponent } from './ebay-category/ebay-category.component';
import { EbayAspectsComponent } from './ebay-aspects/ebay-aspects.component';
import { iSelectedAspects } from 'src/app/model/ebay/item/iSelectedAspects';
import { EbayOffersService } from 'src/app/ebay/ebay-offers/ebay-offers.service';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { EbayVariationsComponent } from './ebay-variations/ebay-variations.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormatTypeEnum, ListingDurationEnum, MarketplaceEnum } from 'src/app/model/ebay/iEbayOffer';
import { CurrencyCodeEnum } from 'src/app/model/ebay/transactionsAndRefunds/iEbayRefundItem';
import { SelectShippingPolicyComponent } from './select-shipping-policy/select-shipping-policy.component';
import { SelectPaymentPolicyComponent } from './select-payment-policy/select-payment-policy.component';
import { SelectReturnPolicyComponent } from './select-return-policy/select-return-policy.component';



@Component({
  selector: 'app-ebay-product',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule, MatInputModule, MatButtonModule, MatIconModule,
     MatSelectModule, MatFormFieldModule, MatIconModule, EbayCategoryComponent, EbayAspectsComponent,
     MatDialogModule, SelectShippingPolicyComponent, SelectPaymentPolicyComponent, SelectReturnPolicyComponent],
  templateUrl: './ebay-product.component.html',
  styleUrl: './ebay-product.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EbayProductComponent implements OnInit {
  @Input('product') product!: iProduct;

  itemOfferSig : WritableSignal<iEbayCreateOffer> = signal<iEbayCreateOffer>({} as iEbayCreateOffer);
  currentAspectsSig : WritableSignal<iSelectedAspects | null> = signal<iSelectedAspects | null>(null);
  itemGroupSig: WritableSignal<iEbayGroupItem> = signal<iEbayGroupItem>({} as iEbayGroupItem);
  inventoryItemsSig: WritableSignal<iEbayInventoryItem[]> = signal<iEbayInventoryItem[]>([]);
  offersSig: WritableSignal<iEbayCreateOffer[]> = signal<iEbayCreateOffer[]>([]);
  categorySig: WritableSignal<Category | null> = signal(null);
  ascpectsSig: WritableSignal<iSelectedAspects | null> = signal(null);
  shippingPolicyIdSig = signal<string>('');

  constructor(private readonly invetoryService: EbayInventoryService, private readonly fb : FormBuilder, 
    private readonly ebayOfferService: EbayOffersService, private readonly dialog: MatDialog, private readonly snackBar: MatSnackBar) {
  }
  ngOnInit(): void {
    if(!this.invetoryService.marktidSig())
    lastValueFrom(this.invetoryService.getEbayDefaultCategoryId()).then((res) => {
      this.invetoryService.marktidSig.set( Number(res.categoryTreeId));
    })

    if(!this.product)
      return; 

    if(this.product && this.product.id && this.product.ebay === 0) {
      //we need title to get category for new offer
      this.itemOfferSig.update((item) => { 
        return { ...item, 
          title: this.product.name 
          } 
        });
        this.itemGroupSig.update((item) => { 
          return { ...item, 
            title: this.product.name,
            inventoryItemGroupKey: this.product.sku,
            }
          });

          this.setOfferGroup();
    }
    

    if(this.product && this.product.id && this.product.ebay === 1) 
      this.getGroupAndOffer();    
  }
  async getGroupAndOffer() {
    await lastValueFrom(this.invetoryService.getInventoryItemGroup(this.product.sku)).then((res) => {
      console.log(res);
      this.itemOfferSig.update((item) => { 
        return { ...item, 
          title: res.title
          } 
        });
        res.inventoryItemGroupKey = this.product.sku;
      this.itemGroupSig.set(res);
      this.currentAspectsSig.set({aspects: res.aspects });
   
    });
    await lastValueFrom(this.ebayOfferService.getOffersBeiSku(this.product.sku)).then((res) => {
     // this.categorySig.set({ categoryId: res.offers[0].categoryId} as Category);
      console.log(res);
    })
  }
  categoryChange(item: Category) {
    this.categorySig.set(item);
  }
  setAspects(aspects: iSelectedAspects) {
    this.ascpectsSig.set(aspects);
  }
  titleChange(title: any) {

    if(title.target && title.target.value.length < 4)
      return;
    this.itemOfferSig.update((item) => { 
      return { ...item, 
        title: title.target.value
        } 
      });
      this.itemGroupSig.update((item) => { 
        return { ...item, 
          title: title.target.value
          }
        });

  }
  openVariations() {

  if(!this.ascpectsSig()) {
    this.snackBar.open('Du hast noch keine erforderlichen Aspekte ausgewählt. Du musst mindestens mit Sternchen (*) markierten auswählen. Am besten aber alle, die farbig markiert sind.!', 'Ok', { duration: 3000 })
    return;
  }

    const config = new MatDialogConfig();
    config.width = '100%';
    config.height = '100%';
    config.minWidth = '100%';
    config.minHeight = '100%';
    config.data = [this.inventoryItemsSig().length > 0 ? this.inventoryItemsSig() : this.product, this.ascpectsSig(), this.itemGroupSig(), this.offersSig()];

    this.dialog.open(EbayVariationsComponent, config).afterClosed().subscribe((res) => {
      if(!res)
        return;
        
      // return [groupItem, variationsSig() ,offersSig()]
      this.itemGroupSig.set(res[0]);
      this.inventoryItemsSig.set(res[1]);
      this.offersSig.set(res[2]);
      console.log(res);
    })
  }
  async setOfferGroup() {
    const merchantLocKeySig = signal('');
    await lastValueFrom(this.invetoryService.getEbayInventoryLocations()).then((res) =>{
      merchantLocKeySig.set(res.locations[0].merchantLocationKey);
      console.log(res);
    })
    const offers: iEbayCreateOffer[] = [];
    this.product.variations.forEach((item) => {
      const offer: iEbayCreateOffer = {} as iEbayCreateOffer;
      offer.format = FormatTypeEnum.FIXED_PRICE;
      offer.listingDescription = this.itemGroupSig().description;
      offer.listingDuration = ListingDurationEnum.GTC;
      offer.marketplaceId = MarketplaceEnum.EBAY_DE;
      offer.pricingSummary = { 
        price: {
          currency : CurrencyCodeEnum.EUR,
          value: Number(item.price).toFixed(2),
        }
      };
      offer.sku = item.sku;
      offer.listingPolicies = {
        fulfillmentPolicyId: this.shippingPolicyIdSig(),
        paymentPolicyId: '',
        returnPolicyId: '',
      };
      offer.merchantLocationKey = merchantLocKeySig();
      offers.push(offer);
    });
    this.offersSig.set(offers);
  }
  setFulFillmentPolicyId(id: string) {
    this.offersSig().forEach((item) => {
      item.listingPolicies.fulfillmentPolicyId = id;
    });
  }
  setPaymentPolicyId(id: string) {
    this.offersSig().forEach((item) => {
      item.listingPolicies.paymentPolicyId = id;
    });
  }
  setReturnPolicy(id: string) {
    this.offersSig().forEach((item) => {
      item.listingPolicies.returnPolicyId = id;
    });
  }

}
