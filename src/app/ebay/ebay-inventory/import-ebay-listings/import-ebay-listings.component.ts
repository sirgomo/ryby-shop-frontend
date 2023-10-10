import { Component, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { EbayInventoryService } from '../ebay-inventory.service';
import { Subscription } from 'rxjs';
import { TextFieldModule } from '@angular/cdk/text-field';
import { ErrorService } from 'src/app/error/error.service';
import { iEbayImportListingRes } from 'src/app/model/ebay/iEbayImportListingRes';

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
  errorList = [''];
  succesList = signal<iEbayImportListingRes[]>([]);
  constructor(private readonly inventoryService: EbayInventoryService, public readonly erroRService: ErrorService ) {}
  ngOnDestroy(): void {
   this.subs.unsubscribe();
  }
  sendItems() {
    if(this.items.length < 10)
      return;
      this.inventoryService.postListingsString(this.items).subscribe(res => {
        if(res.length > 0) {
          this.succesList.set(res);
        } else {
          this.erroRService.newMessage(JSON.stringify(res));
        }

      });
  }
}
