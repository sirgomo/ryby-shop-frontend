import { ChangeDetectionStrategy, Component, Inject, effect, signal } from '@angular/core';
import { DashboardService } from '../../dashboard.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { HelperService } from 'src/app/helper/helper.service';
import { lastValueFrom } from 'rxjs';
import { iShopMonthDetails } from 'src/app/model/iShopMonthDetails';

@Component({
  selector: 'app-shop-details',
  standalone: true,
  imports: [MatExpansionModule, MatIconModule, MatButtonModule],
  templateUrl: './shop-details.component.html',
  styleUrl: './shop-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopDetailsComponent {
  yearSig = signal(0);
  monthSig = signal('');
  shopData = signal<iShopMonthDetails[]>([]);
  constructor(private readonly service: DashboardService, @Inject(MAT_DIALOG_DATA) private data: { 'year': number, 'month': number },
   private readonly dialRef: MatDialogRef<ShopDetailsComponent>,
   private readonly helper: HelperService,
  ) {
    if (this.data) {
      this.yearSig.set(this.data.year);
      this.monthSig.set(this.service.months[this.data.month]);
 

      effect(() => {
        lastValueFrom(this.service.getMonthDetailShop(this.data.month +1, this.data.year, this.helper.pageNrSig(), this.helper.artikelProSiteSig())).then((res) => {
          this.shopData.set(res);
        })
      }, { allowSignalWrites: true })

      if(this.helper.artikelProSiteSig() === 0) 
        this.helper.artikelProSiteSig.set(100);

    }

   }

   close() {
    this.dialRef.close();
   }

   getTotalNetto( item: iShopMonthDetails) {
      let netto = Number(item.total) - Number(item.shipping) - Number(item.tax);
      item.produkts.forEach((item) => {
        netto -= Number(item.verkauf_rabat);
        netto -=  ((Number(item.peuro) * Number(item.squantity))) * Number(item.menge);
      })
      return netto;
   }
   getNettoPerItem(item: iShopMonthDetails) {
      let netto = (Number(item.verkauf_price) - Number(item.verkauf_rabat) - Number(item.verkauf_steuer) - (Number(item.peuro) * Number(item.squantity))) * Number(item.menge);
    return netto;
   }
   getWholesalePrice(prod: iShopMonthDetails) {
    return (Number(prod.peuro) * Number(prod.squantity)) * Number(prod.menge);
  }
}
