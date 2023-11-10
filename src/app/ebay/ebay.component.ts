import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EbayService } from './ebay.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { InoviceComponent } from '../inovice/inovice.component';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { iEbayOrder } from '../model/ebay/orders/iEbayOrder';
import { iBestellung } from '../model/iBestellung';
import { iUserData } from '../model/iUserData';
import { iProductBestellung } from '../model/iProductBestellung';
import { iProduct } from '../model/iProduct';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ebay',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, InoviceComponent, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './ebay.component.html',
  styleUrls: ['./ebay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EbayComponent {
  ebaySoldItems = toSignal(this.serv.getItemsSoldBeiEbay());
  ebaycode = '';
  show_input = false;
  displayedColumns: string[] = ['orderNumber', 'buyerUsername', 'totalPrice', 'orderStatus', 'orderDate', 'shippedAm', 'invoice'];
  constructor (private readonly serv: EbayService, private readonly dialog: MatDialog) {};

  getLink() {
   const link = this.serv.getLinkForUserConsent().subscribe((res) => {
    const win = window.open(res.address, '_blank');
    if(win) {
      win.focus();
      link.unsubscribe();
      this.show_input = true;
    }

   })
  }
  openInovice(item: iEbayOrder) {
    const itemB: iBestellung = {} as iBestellung;
    const userD: iUserData = {} as iUserData;
    userD.adresse = {
      strasse: item.buyer.buyerRegistrationAddress.contactAddress.addressLine1,
      postleitzahl: item.buyer.buyerRegistrationAddress.contactAddress.postalCode,
      stadt: item.buyer.buyerRegistrationAddress.contactAddress.city,
      land: item.buyer.buyerRegistrationAddress.contactAddress.countryCode,
      hausnummer: item.buyer.buyerRegistrationAddress.contactAddress.addressLine2,
    }

    itemB.kunde = userD;
    itemB.gesamtwert = Number(item.pricingSummary.total.value);
    itemB.bestelldatum = new Date(item.creationDate);
    const items : iProductBestellung[] = [];
    for (let i = 0; i < item.lineItems.length; i++) {
      const newItem = {} as iProductBestellung;
      const prod : iProduct = {} as iProduct;
      prod.name = item.lineItems[i].title;
      prod.promocje = [];
      if(!item.lineItems[i].taxes[0])
        prod.mehrwehrsteuer = 0;
      newItem.menge = Number(item.lineItems[i].quantity);
      newItem.verkauf_price = Number(item.lineItems[i].lineItemCost.value);
      newItem.color = item.lineItems[i].sku;
      newItem.produkt = [prod];
    }
    itemB.produkte = items;
    itemB.versandprice = Number(item.pricingSummary.deliveryCost.value);

    const dialogConf: MatDialogConfig = new MatDialogConfig();
    dialogConf.data = itemB;
    dialogConf.width = '100%';
    dialogConf.height = '100%';

    this.dialog.open(InoviceComponent, dialogConf);



  }

}
