import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { EbayInventoryService } from '../ebay-inventory.service';
import { Subscription } from 'rxjs';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-import-ebay-listings',
  standalone: true,
  imports: [CommonModule, MatInputModule, FormsModule, MatButtonModule, TextFieldModule],
  templateUrl: './import-ebay-listings.component.html',
  styleUrls: ['./import-ebay-listings.component.scss']
})
export class ImportEbayListingsComponent implements OnDestroy {
  items = '';
  subs = new Subscription();
  constructor(private readonly inventoryService: EbayInventoryService ) {}
  ngOnDestroy(): void {
   this.subs.unsubscribe();
  }
  sendItems() {
    if(this.items.length < 10)
      return;

      this.inventoryService.postListingsString(this.items).subscribe();
  }
}
