import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EbayInventoryService } from './ebay-inventory.service';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { iEbayInventory } from 'src/app/model/ebay/iEbayInventory';
import { MatTabsModule } from '@angular/material/tabs';
import { ImportEbayListingsComponent } from './import-ebay-listings/import-ebay-listings.component';
import { Observable } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ErrorService } from 'src/app/error/error.service';
import { ErrorComponent } from 'src/app/error/error.component';
import { iEbayInventoryItem } from 'src/app/model/ebay/iEbayInventoryItem';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { EbayOffersComponent } from '../ebay-offers/ebay-offers.component';

@Component({
  selector: 'app-ebay-inventory',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatTableModule, MatButtonModule, FormsModule, MatTabsModule, ImportEbayListingsComponent, MatFormFieldModule,
     MatCheckboxModule, ErrorComponent, MatDialogModule, EbayOffersComponent],
  templateUrl: './ebay-inventory.component.html',
  styleUrls: ['./ebay-inventory.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EbayInventoryComponent {
  itemsProSite = 100;
  currentSite = 0;
  zeigtNurEinProGroupSig = signal(true);
  itemsSig$: Observable<iEbayInventory> = this.inventorySer.getCurrentInventory(this.itemsProSite, this.currentSite, this.zeigtNurEinProGroupSig());

  columns = ['sku', 'title', 'inshop']

  constructor(private readonly inventorySer: EbayInventoryService, public readonly errorService: ErrorService, private readonly dialog: MatDialog) {}
  update(val: any) {
    this.itemsProSite = val;
    this.itemsSig$ = this.inventorySer.getCurrentInventory(this.itemsProSite, this.currentSite, this.zeigtNurEinProGroupSig());
  }
  goNext() {
    this.currentSite += this.itemsProSite;
    this.itemsSig$ = this.inventorySer.getCurrentInventory(this.itemsProSite, this.currentSite, this.zeigtNurEinProGroupSig());
  }
  goBack() {
    this.currentSite -= this.itemsProSite;
    this.itemsSig$ = this.inventorySer.getCurrentInventory(this.itemsProSite, this.currentSite, this.zeigtNurEinProGroupSig());
  }
  showAllProduktsInGroup() {
    if(this.zeigtNurEinProGroupSig() === true) {
      this.zeigtNurEinProGroupSig.set(false);
    } else {
      this.zeigtNurEinProGroupSig.set(true);
    }
    this.itemsSig$ = this.inventorySer.getCurrentInventory(this.itemsProSite, this.currentSite, this.zeigtNurEinProGroupSig());
  }
  addItemToShop(item: iEbayInventoryItem) {
    const conf = new MatDialogConfig();
    conf.height = '100%';
    conf.width = '100%';
    conf.minWidth = '100%';
    conf.data = item;

    this.dialog.open(EbayOffersComponent, conf);
  }
}
