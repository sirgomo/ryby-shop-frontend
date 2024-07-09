import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule, isPlatformServer } from '@angular/common';
import { iSordedVariation } from 'src/app/model/iSortedVariation';
import { iProduct } from 'src/app/model/iProduct';
import { iProduktVariations } from 'src/app/model/iProduktVariations';
import { getSortedVariation } from '../functions';


@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent implements OnInit{

  @ViewChildren('select') selects!: QueryList<ElementRef>;
  @Input('item') item!: iProduct;
  @Output() current = new EventEmitter<iProduktVariations>();
  sortedVarations!: iSordedVariation[];

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}
  ngOnInit(): void {
    this.sortedVarations = getSortedVariation(this.item);
  }

  colorChange(index: any) {
    if(isPlatformServer(this.platformId))
    return;


    const getIndex = this.item.variations.findIndex((tmp) => tmp.sku === index.value);
    this.resetSelector(index);

    if(getIndex !== -1)
    this.current.emit(this.item.variations[getIndex]);
   }
   resetSelector(index? : any) {

    if(!this.selects)
    return;

    this.selects.forEach((item) => {
      if(index && item.nativeElement !== index)
        item.nativeElement.value = '---';
    })

   }
   getSelected (is: number) {
      return '---';
   }
}
