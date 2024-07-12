import { ChangeDetectionStrategy, Component, effect, Input, output, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { EbayInventoryService } from 'src/app/ebay/ebay-inventory/ebay-inventory.service';
import { Category, iEbayCategorySugestion } from 'src/app/model/ebay/item/iEbayCategorySugestion';
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
  @Input('item') item!: WritableSignal<iEbayGroupItem>;
  categorySig: WritableSignal<iEbayCategorySugestion> = signal({} as iEbayCategorySugestion);
  selected: Category = {} as Category;
  
  constructor(private readonly invetoryService: EbayInventoryService) {
    effect(() => {
      if(this.item().inventoryItemGroupKey && this.item().inventoryItemGroupKey.length > 2) {
        
      } else if(this.invetoryService.marktidSig() && this.item.name)
        lastValueFrom(this.invetoryService.getEbayCategorySugestion(this.invetoryService.marktidSig()!, this.item().title)).then((res) => {
        this.categorySig.set(res);  
      });
    }, { allowSignalWrites: true })
  }
  change() {
    this.categoryChange.emit(this.selected);
  }
}
