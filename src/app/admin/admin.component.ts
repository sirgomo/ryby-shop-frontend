import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { EbayNettoComponent } from './dashboard/ebay-netto/ebay-netto.component';
import { EbayShopComponent } from './dashboard/ebay-shop/ebay-shop.component';
import { ShopMonthsComponent } from './dashboard/shop-months/shop-months.component';
import { ShopNettoComponent } from './dashboard/shop-netto/shop-netto.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { DashboardService } from './dashboard/dashboard.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [EbayNettoComponent, EbayShopComponent, ShopMonthsComponent, ShopNettoComponent, MatSelectModule, MatFormFieldModule, FormsModule, CommonModule]
})
export class AdminComponent {
  selectedValue = this.service.selectedYearSig();
  items = this.service.yearsSig;
  constructor( private readonly service: DashboardService ) {
      lastValueFrom(this.service.getJahres());
      lastValueFrom(this.service.getEbayShopData());
      lastValueFrom(this.service.getEbayNettoData());
      lastValueFrom(this.service.getStoreNettoData());
      lastValueFrom(this.service.getMonthData());
  }
  onSelectedYearChange(year: string) {
   lastValueFrom(this.service.getEbayShopData(year));
   lastValueFrom(this.service.getEbayNettoData());
   lastValueFrom(this.service.getStoreNettoData());
   lastValueFrom(this.service.getMonthData());
  }
//ebay - shop jahr, wie viel verkauft in shop und ebay
//ebay werdint after costen
//shop verdint after costen
//na dole current jahr slupki czyli 4 card laczenie, ilosc sprzedazy na miesiac w sklepie i na ebay
}
