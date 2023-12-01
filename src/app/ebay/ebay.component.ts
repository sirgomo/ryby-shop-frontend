import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EbayService } from './ebay.service';
import { toSignal } from '@angular/core/rxjs-interop';
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
import { EbayTransactionsComponent } from './ebay-transactions/ebay-transactions.component';
import { ErrorComponent } from '../error/error.component';
import { ErrorService } from '../error/error.service';
import { RefundComponent } from '../refund/refund.component';
import { iAktion } from '../model/iAktion';
import { map, tap } from 'rxjs';
import { iRefunds } from '../model/iRefund';
import { iEbayAllOrders } from '../model/ebay/orders/iEbayAllOrders';
import { ReasonForRefundEnum } from '../model/ebay/transactionsAndRefunds/iEbayRefunds';

@Component({
  selector: 'app-ebay',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, InoviceComponent, MatDialogModule, MatButtonModule, MatIconModule, EbayTransactionsComponent, ErrorComponent, RefundComponent],
  templateUrl: './ebay.component.html',
  styleUrls: ['./ebay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EbayComponent {

  ebaySoldItems$ = this.serv.itemsSoldByEbaySig
  ebaycode = '';
  show_input = false;
  displayedColumns: string[] = ['orderNumber', 'buyerUsername', 'totalPrice', 'orderStatus', 'orderDate', 'shippedAm', 'invoice', 'buchen', 'refund'];
  constructor (private readonly serv: EbayService, private readonly dialog: MatDialog, public readonly errorService: ErrorService) {};

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
    if(item.buyer.buyerRegistrationAddress.email)
    userD.email = item.buyer.buyerRegistrationAddress.email;
    userD.vorname = item.buyer.buyerRegistrationAddress.fullName.split(' ')[0];
    userD.nachname = item.buyer.buyerRegistrationAddress.fullName.split(' ')[1];
    itemB.kunde = userD;
    itemB.gesamtwert = Number(item.pricingSummary.total.value);
    itemB.bestelldatum = new Date(item.creationDate);
    //it canotbe id, because id is number and need to be null
    itemB.varsandnr = item.orderId;
    const items : iProductBestellung[] = [];
    itemB.versandprice = Number(item.pricingSummary.deliveryCost.value);
    for (let i = 0; i < item.lineItems.length; i++) {
      const newItem = {} as iProductBestellung;
      const prod : iProduct = {} as iProduct;
      prod.name = item.lineItems[i].title;
      prod.sku = item.lineItems[i].sku;

      if(!item.lineItems[i].taxes[0])
        prod.mehrwehrsteuer = 0;

      newItem.verkauf_steuer = prod.mehrwehrsteuer;
      newItem.menge = Number(item.lineItems[i].quantity);

      newItem.verkauf_price = Number(item.lineItems[i].lineItemCost.value) / Number(item.lineItems[i].quantity);
      if(item.pricingSummary.priceDiscount) {
        let rabatProStuck = Number(item.pricingSummary.priceDiscount.value) / Number(item.lineItems[i].quantity);
        if(item.lineItems.length > 1)
        rabatProStuck = rabatProStuck / Number(item.lineItems.length);
        newItem.rabatt = Number(rabatProStuck);
        prod.promocje =  [{id: 1} as iAktion];
      }

      if(item.pricingSummary.deliveryDiscount) {
        itemB.versandprice += Number(item.pricingSummary.deliveryDiscount.value);
      }


      newItem.color = item.lineItems[i].variationAspects[0].name+' '+item.lineItems[i].variationAspects[0].value;
      newItem.produkt = [prod];

      items.push(newItem);
    }

    itemB.produkte = items;


    const current = this.serv.ebayItems.value;
    if(current) {
      const index = current.orders.findIndex((tmp) => tmp.orderId === item.orderId);
      const refunds = Object(current.orders[index]).refunds;
      console.log(this.getRefundValue(refunds))
    }


    const dialogConf: MatDialogConfig = new MatDialogConfig();
    dialogConf.data = itemB;
    dialogConf.width = '100%';
    dialogConf.height = '100%';

    this.dialog.open(InoviceComponent, dialogConf);



  }
  refund(order: iEbayOrder) {
    const dialogConf: MatDialogConfig = new MatDialogConfig();
    dialogConf.data = order
    dialogConf.width = '100%';
    dialogConf.height = '100%';

    const subs = this.dialog.open(RefundComponent, dialogConf).afterClosed().pipe(
      map((res) => {

        if(res) {
          const current = this.serv.ebayItems.value;
        const length = res.length;
         if(current) {
          const index = current.orders.findIndex((item) => item.orderId === res[length-1].orderId);

          if(index !== -1) {
            const newItems = {} as iEbayAllOrders;
            Object.assign(newItems, current);
            const tmporders = newItems.orders.slice(0);

         //   res[0].amount = Object(getRefundValue(res)).count;
           tmporders[index] = {
              ...current.orders[index],
              refunds: res,
             } as iEbayOrder;
             newItems.orders = tmporders;

            this.serv.ebayItems.next(newItems);

            }
         }
        }

        subs.unsubscribe();
        return res;
      })
    ).subscribe();
  }
  getRefundValue(res: iRefunds[]) {
    let count = { count : 0 };


    if(!res.length || res.length === 0 )
    return count;

    for (let i = 0; i < res.length; i++) {

      if(res[i].id === -1)
        break;

        console.log(res[i])
      if (res[i].amount && +res[i].amount > 0)
        count.count += Number(res[i].amount);

      const reasons = Object.values(ReasonForRefundEnum).filter((reason) => typeof reason === 'string');


      for(let z = 0; z < reasons.length; z++) {

        if(Object(count).reasons[z] === undefined)
          Object(count).reasons[z] = 0;


        console.log(' oa ' +Object(count).reason[z])
        Object(count).reasons[z] += res[i].amount;
      }


      if(res[i].refund_items)
        for (let j = 0; j < res[i].refund_items.length; j++) {
          if (res[i].refund_items[j].amount > 0)
            Object(count).count += Number(res[i].refund_items[j].amount);
        }
    }
    return count;
  }

}

