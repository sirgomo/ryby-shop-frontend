import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { iEbayOrder } from 'src/app/model/ebay/orders/iEbayOrder';
import { EbayTransactionsService } from './ebay-transactions.service';
import { Observable } from 'rxjs';
import { iEbayTransaction } from 'src/app/model/ebay/transactionsAndRefunds/iEbayTransaction';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { iEbayTransactionItem } from 'src/app/model/ebay/transactionsAndRefunds/iEbayTransactionItem';
import { ErrorService } from 'src/app/error/error.service';

@Component({
  selector: 'app-ebay-transactions',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './ebay-transactions.component.html',
  styleUrl: './ebay-transactions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EbayTransactionsComponent implements OnInit {

  @Input() item!: iEbayOrder;
  isItem$  = new Observable<iEbayTransaction>();
  constructor(private readonly service: EbayTransactionsService, public readonly errorService: ErrorService ) {}
  ngOnInit(): void {
    this.isItem$ = this.service.getTransactionById(this.item.orderId);
  }
  transaction_booking() {
    if(this.item.orderPaymentStatus.toString() !== 'PAID') {
      this.errorService.message.set('Transaction not paid !');
      return;
    }
    const item: iEbayTransaction = {} as iEbayTransaction;
    item.orderId = this.item.orderId;
    item.payment_status = this.item.orderPaymentStatus;
    item.price_total = Number(this.item.pricingSummary.total.value);
    item.price_shipping = Number(this.item.pricingSummary.deliveryCost.value);
    if(this.item.pricingSummary.deliveryDiscount)
    item.price_shipping += Number(this.item.pricingSummary.deliveryDiscount.value);
    item.price_tax = this.item.pricingSummary.tax ? Number(this.item.pricingSummary.tax.value): 0;
    item.price_discont = this.item.pricingSummary.priceDiscount ? Number(this.item.pricingSummary.priceDiscount.value): 0;
    item.ebay_fee = this.item.totalMarketplaceFee ? Number(this.item.totalMarketplaceFee.value) : 0;
    item.zahlungsart = this.item.paymentSummary.payments[0] ? this.item.paymentSummary.payments[0].paymentMethod: '';
    item.items = [];
    item.refunds = [];
    item.sel_amount = 0;
    for (let i = 0; i < this.item.lineItems.length; i++) {
      const element = {} as iEbayTransactionItem;
      element.sku = this.item.lineItems[i].sku;
      element.title = this.item.lineItems[i].title;
      element.quanity = Number(this.item.lineItems[i].quantity);
      element.price = Number(this.item.lineItems[i].lineItemCost.value);
      item.items.push(element);
      item.sel_amount += element.quanity;
    }

    this.isItem$ = this.service.createTransaction(item);
    }
}
