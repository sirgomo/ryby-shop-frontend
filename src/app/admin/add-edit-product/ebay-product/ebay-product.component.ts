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
import { iEbayAspects } from 'src/app/model/ebay/item/iEbayAspects';
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



@Component({
  selector: 'app-ebay-product',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule, MatInputModule, MatButtonModule, MatIconModule,
     MatSelectModule, MatFormFieldModule, MatIconModule, EbayCategoryComponent, EbayAspectsComponent, MatDialogModule],
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

  constructor(private readonly invetoryService: EbayInventoryService, private readonly fb : FormBuilder, private readonly ebayOfferService: EbayOffersService, private readonly dialog: MatDialog) {
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
            title: this.product.name 
            }
          });
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
    const config = new MatDialogConfig();
    config.minWidth = '100%';
    config.minHeight = '100%';
    config.data = this.inventoryItemsSig().length > 0 ? this.inventoryItemsSig() : this.product.variations;

    this.dialog.open(EbayVariationsComponent, config).afterClosed().subscribe((res) => {
      console.log(res);
    })
  }

}
