import { ChangeDetectionStrategy, Component, Inject, computed, effect, signal } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { lastValueFrom } from 'rxjs';
import { HelperService } from 'src/app/helper/helper.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { iEbayMonthDetails } from 'src/app/model/ebay/iEbayMothDetails';

@Component({
  selector: 'app-ebay-details',
  standalone: true,
  imports: [MatExpansionModule, MatIconModule, MatButtonModule],
  templateUrl: './ebay-details.component.html',
  styleUrl: './ebay-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EbayDetailsComponent {
  yearSig = signal(0);
  monthSig = signal('');
  ebayData = signal<iEbayMonthDetails[]>([]);

  constructor(private readonly service: DashboardService, @Inject(MAT_DIALOG_DATA) public data: { 'year': number, 'month': number },
   private readonly helper: HelperService,
   private readonly dialRef: MatDialogRef<EbayDetailsComponent>
   ) {
    if (data) {
      this.yearSig.set(this.data.year);
      this.monthSig.set(this.service.months[this.data.month]);
 

      effect(() => {
        lastValueFrom(this.service.getMonthDetailEbay(this.data.month +1, this.data.year, this.helper.pageNrSig(), this.helper.artikelProSiteSig())).then((res) => {
          this.ebayData.set(res);

        })
      }, { allowSignalWrites: true })

      if(this.helper.artikelProSiteSig() === 0) 
        this.helper.artikelProSiteSig.set(100);

    }

  }
  close() {
    this.dialRef.close();
  }
  getShipping(shipping: string, descount: string) {
    return (Number(shipping) + Number(descount)).toFixed(2);
  }
  getNetto(item: iEbayMonthDetails) {

    let netto = Number(item.total) - Number(item.ebay_fee) - Number(item.discon) - Number(item.shipping);
    for (let i = 0; i < item.products.length; i++) {
      netto -= (Number(item.products[i].peuro) * Number(item.products[i].quantity_at_once) * Number(item.products[i].quantity));
    }
    return netto.toFixed(2);
  }
  getNettoPerItem(prod: iEbayMonthDetails) {
    return Number(prod.price) - (Number(prod.quantity_at_once) * Number(prod.peuro) * Number(prod.quantity));
  }
}
