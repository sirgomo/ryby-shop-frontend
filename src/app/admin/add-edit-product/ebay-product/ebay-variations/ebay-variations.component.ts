import { ChangeDetectionStrategy, Component, Inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EbayInventoryService } from 'src/app/ebay/ebay-inventory/ebay-inventory.service';
import { iEbayInventoryItem } from 'src/app/model/ebay/iEbayInventoryItem';
import { iProduktVariations } from 'src/app/model/iProduktVariations';

@Component({
  selector: 'app-ebay-variations',
  standalone: true,
  imports: [],
  templateUrl: './ebay-variations.component.html',
  styleUrl: './ebay-variations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EbayVariationsComponent implements OnInit {
  variations: WritableSignal<iEbayInventoryItem[]> = signal<iEbayInventoryItem[]>([]);
    constructor(private readonly inventoryService: EbayInventoryService, @Inject(MAT_DIALOG_DATA) public data: iProduktVariations[] | iEbayInventoryItem[]) {
      if (this.data[0] && this.isType(this.data[0])) {
        this.data.forEach((item) => {
            this.variations().push(item as iEbayInventoryItem);
        })
      }
    }
    ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      
    }
    isType(obj : any ) : obj is iProduktVariations {
      return 'product' in obj;
    }
}
