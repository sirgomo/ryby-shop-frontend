import { Component, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { EbayInventoryService } from '../ebay-inventory.service';
import { Subscription } from 'rxjs';
import { TextFieldModule } from '@angular/cdk/text-field';
import { ErrorService } from 'src/app/error/error.service';
import { ErrorComponent } from 'src/app/error/error.component';

@Component({
  selector: 'app-import-ebay-listings',
  standalone: true,
  imports: [CommonModule, MatInputModule, FormsModule, MatButtonModule, TextFieldModule, ErrorComponent],
  templateUrl: './import-ebay-listings.component.html',
  styleUrls: ['./import-ebay-listings.component.scss']
})
export class ImportEbayListingsComponent implements OnDestroy {
  items = '';
  subs = new Subscription();

  succesList = signal<string[]>([]);
  constructor(private readonly inventoryService: EbayInventoryService, public readonly erroRService: ErrorService ) {}
  ngOnDestroy(): void {
   this.subs.unsubscribe();
  }
  sendItems() {
    if(this.items.length < 10)
      return;

      this.inventoryService.postListingsString(this.items).subscribe(res => {
        const error: string[] = [];
            if(Object(res).responses.length > 0) {
              const items: string[] = [];

                for(let i = 0; i < Object(res).responses.length; i++) {
                  if(Object(res).responses[i].statusCode == 200) {
                    items.push('ok, item with id '+Object(res).responses[i].listingId + ' wurde Erfolgreich hinzugefügt\n');
                  } else {
                    error.push(JSON.stringify(Object(res).responses[i]));
                  }

                }
              this.succesList.set(items);
            }
            if(error.length > 0)
              this.erroRService.newMessage(JSON.stringify(error));
      });
  }
}
