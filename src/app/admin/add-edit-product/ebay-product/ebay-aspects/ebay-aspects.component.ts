import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, Input, output, signal, WritableSignal } from '@angular/core';
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
  @Input('category') categorySig!: WritableSignal<Category | null>;
  @Input('current_aspects') current_aspectsSig!: WritableSignal<iSelectedAspects| null>;
  aspectsSig: WritableSignal<iEbayAspect[]> = signal([]);
  selected_aspects = output<iSelectedAspects>();
  mode = ItemToAspectCardinalityEnum;
  usageEnum = AspectUsageEnum;
  aspectModeEnum = AspectModeEnum;
  showOptional = false;
  input: string[] = [];
  constructor(private readonly inventoryService: EbayInventoryService, private readonly changeDet: ChangeDetectorRef) {
    effect(() => {
      if(this.categorySig()) {
        lastValueFrom(this.inventoryService.getAspectsForCategoryId(Number(this.categorySig()!.categoryId))).then((res) => {
          this.aspectsSig.set(res.aspects);
          
        });
      }   
    }, { allowSignalWrites: true });
    effect(() => {
      if(this.current_aspectsSig()) {
        for (let i = 0; i < this.aspectsSig().length; i++) {
          const tmp = this.current_aspectsSig()?.aspects;
          if(tmp) {
            Object.keys(tmp).forEach((item) => {
              if(this.aspectsSig()[i].localizedAspectName === item) {
               this.input[i] = (tmp as any)[item].toString();
              }
            })
          } 

         }
      }
    }, { allowSignalWrites: true })

  }

  setAspect(index: number, value? : string, checked?: boolean) {

    if(this.aspectsSig()[index].aspectConstraint.itemToAspectCardinality === ItemToAspectCardinalityEnum.MULTI && checked !== undefined) {

      if(this.input[index] && value && checked) {
       this.input[index] = [this.input[index], value].toString();
      }

      if(this.input[index] && value && !checked) {
        this.input[index] = this.input[index].split(',').filter((item) => item !== value).toString();
      }

      if(!this.input[index] && value)
        this.input[index] = value;

      this.change();

    } else if(this.aspectsSig()[index].aspectConstraint.itemToAspectCardinality === ItemToAspectCardinalityEnum.SINGLE) {
      if(value)
        this.input[index] = value;  
      this.change();  
      }
      
  }

  getCheckbox(idx: number, index: number) {
    if(!this.input[idx])
      return false;
  
    const items = this.aspectsSig()[idx].aspectValues;
    const slected = this.input[idx].split(',');
    console.log(slected);
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
        
          [this.aspectsSig()[i].localizedAspectName] : [this.input[i].toString()]
        
       }
       
      }    
    }
    this.selected_aspects.emit(items);
  }
  compareSelected(s1: any, s2: any) {
    return s1 === s2 ? true : false;
  }
}
