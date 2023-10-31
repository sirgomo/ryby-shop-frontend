import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, Optional, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { iEbayInventoryItem } from 'src/app/model/ebay/iEbayInventoryItem';
import { EbayOffersService } from '../ebay-offers.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { toSignal } from '@angular/core/rxjs-interop';
import { iEbayOfferListingRes } from 'src/app/model/ebay/iEbayOfferListingRes';
import { ErrorComponent } from 'src/app/error/error.component';
import { ErrorService } from 'src/app/error/error.service';
import { MatIconModule } from '@angular/material/icon';
import { EbayInventoryService } from '../ebay-inventory/ebay-inventory.service';

@Component({
  selector: 'app-ebay-offers',
  standalone: true,
  imports: [CommonModule, ErrorComponent, MatIconModule],
  templateUrl: './ebay-offers.component.html',
  styleUrls: ['./ebay-offers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EbayOffersComponent implements OnInit{

  offer = toSignal(this.offerService.getOffersBeiSku(this.group.sku), { initialValue: {} as iEbayOfferListingRes});
  invgroup = toSignal(this.inventoryService.getInventoryItemGroup(this.group.groupIds![0]));
  constructor(private readonly offerService: EbayOffersService, @Optional() @Inject(MAT_DIALOG_DATA) private group: iEbayInventoryItem,
  public errMessage: ErrorService, private dialRef: MatDialogRef<EbayOffersComponent>, private readonly inventoryService: EbayInventoryService) {}

  ngOnInit(): void {
      console.log(this.group);
      console.log(this.offer().offers);
      console.log(this.invgroup());
  }
  close() {
    this.dialRef.close();
  }
}
