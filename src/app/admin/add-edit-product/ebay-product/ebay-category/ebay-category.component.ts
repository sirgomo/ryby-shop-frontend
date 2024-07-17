import { ChangeDetectionStrategy, Component, effect, Input, output, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { EbayInventoryService } from 'src/app/ebay/ebay-inventory/ebay-inventory.service';
import { Category, iEbayCategorySugestion } from 'src/app/model/ebay/item/iEbayCategorySugestion';
import { iEbayCreateOffer } from 'src/app/model/ebay/item/iEbayCreateOffer';
import { iEbayGroupItem } from 'src/app/model/ebay/item/iEbayGroupItem';

@Component({
  selector: 'app-ebay-category',
  standalone: true,
  imports: [MatSelectModule, MatFormFieldModule, FormsModule],
  templateUrl: './ebay-category.component.html',
  styleUrl: './ebay-category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EbayCategoryComponent  {
  categoryChange = output<Category>();
  @Input('item') item!: WritableSignal<iEbayCreateOffer>;
  categorySig: WritableSignal<iEbayCategorySugestion> = signal({} as iEbayCategorySugestion);
  selected: Category = {} as Category;
  
  constructor(private readonly invetoryService: EbayInventoryService) {
    effect(() => {
        if(this.invetoryService.marktidSig() && this.item() && Object(this.item()).title)
          lastValueFrom(this.invetoryService.getEbayCategorySugestion(this.invetoryService.marktidSig()!, Object(this.item()).title)).then((res) => {
          if(res.categorySuggestions) {
            this.categorySig.set(res);  
            //select and emit first category
            this.selected = res.categorySuggestions[0].category;
            this.categoryChange.emit(res.categorySuggestions[0].category);
            
            //item on ebay, if category not null, use it.
            if(this.item().categoryId)
              res.categorySuggestions.forEach((item) => {
                if(item.category.categoryId == this.item().categoryId) 
                  this.selected = item.category;
                  this.categoryChange.emit(this.selected);
                });
          }
        

      
          });
    }, { allowSignalWrites: true })
  }
  change() {
    this.categoryChange.emit(this.selected);
  }
}
