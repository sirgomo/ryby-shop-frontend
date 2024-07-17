import { ChangeDetectionStrategy, Component, effect, Input, output, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { lastValueFrom } from 'rxjs';
import { EbayInventoryService } from 'src/app/ebay/ebay-inventory/ebay-inventory.service';
import { iEbayAspect, ItemToAspectCardinalityEnum, AspectUsageEnum, AspectModeEnum } from 'src/app/model/ebay/item/iEbayAspects';
import { Category } from 'src/app/model/ebay/item/iEbayCategorySugestion';
import { iSelectedAspects } from 'src/app/model/ebay/item/iSelectedAspects';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';


@Component({
  selector: 'app-ebay-aspects',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, MatInputModule, MatAutocompleteModule, MatCheckboxModule],
  templateUrl: './ebay-aspects.component.html',
  styleUrl: './ebay-aspects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EbayAspectsComponent {
  @Input('category') category!: WritableSignal<Category | null>;
  aspects: WritableSignal<iEbayAspect[]> = signal([]);
  selected_aspects = output<iSelectedAspects>();
  mode = ItemToAspectCardinalityEnum;
  usageEnum = AspectUsageEnum;
  aspectModeEnum = AspectModeEnum;
  showOptional = false;
  input: string[] = [];
  constructor(private readonly inventoryService: EbayInventoryService) {
    effect(() => {
      if(this.category()) {
        lastValueFrom(this.inventoryService.getAspectsForCategoryId(Number(this.category()!.categoryId))).then((res) => {
          this.aspects.set(res.aspects);

        })
      }
    }, { allowSignalWrites: true });

  }

  setAspect(index: number, value? : string, checked?: boolean) {
    if(this.aspects()[index].aspectConstraint.itemToAspectCardinality === ItemToAspectCardinalityEnum.MULTI) {

      if(this.input[index] && value && checked) {
       this.input[index] = [this.input[index], value].toString();
      }

      if(this.input[index] && value && !checked) {
        this.input[index] = this.input[index].split(',').filter((item) => item !== value).toString();
      }

      if(!this.input[index] && value)
        this.input[index] = value;

    } else {
      if(value)
        this.input[index] = value;    
      }
  }

  getValueItem(index: number, value: string) {

    if(this.input[index])
      return this.input[index];

    return value;
  }
  getCheckbox(idx: number, index: number) {
    if(!this.input[idx] || this.input[idx].split(',').length < 1)
      return false;

    const items = this.aspects()[idx].aspectValues;
    const slected = this.input[idx].split(',');

      const tmp = slected.findIndex((item) => item === items[index].localizedValue);
      if(tmp === -1)
        return false;

    return true;
  }
  change() {
    const items :iSelectedAspects = { aspects : {} };
    for (let i = 0; i < this.input.length; i++) {
      if(this.input[i]) {
       items.aspects = {
        ...items.aspects,
        
          [this.aspects()[i].localizedAspectName] : [this.input[i]]
        
       }
       
      }    
    }
    this.selected_aspects.emit(items);
  }
}
