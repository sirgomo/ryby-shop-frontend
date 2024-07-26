import { ChangeDetectionStrategy, Component, Input, Signal, WritableSignal } from '@angular/core';
import { EbayInventoryService } from 'src/app/ebay/ebay-inventory/ebay-inventory.service';
import { iEbayInventoryItem } from 'src/app/model/ebay/iEbayInventoryItem';

@Component({
  selector: 'app-selected-variation-list',
  standalone: true,
  imports: [],
  templateUrl: './selected-variation-list.component.html',
  styleUrl: './selected-variation-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectedVariationListComponent {
  @Input('variation') variation!: WritableSignal<iEbayInventoryItem[]>;
  @Input('start') start!: Signal<number>;
  @Input('stop') stop!: Signal<number>;
  constructor(private readonly invenService: EbayInventoryService) {
  }
} 
