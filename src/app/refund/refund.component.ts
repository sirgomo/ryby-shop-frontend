import { ChangeDetectionStrategy, Component, Inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { iEbayOrder } from '../model/ebay/orders/iEbayOrder';
import { ErrorService } from '../error/error.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorComponent } from '../error/error.component';
import { EbayTransactionsService } from '../ebay/ebay-transactions/ebay-transactions.service';
import { iEbayTransaction } from '../model/ebay/transactionsAndRefunds/iEbayTransaction';
import { iRefundItem } from '../model/iRefundItem';
import { Observable, map, tap } from 'rxjs';
import { iRefunds } from '../model/iRefund';
import { iEbayTransactionItem } from '../model/ebay/transactionsAndRefunds/iEbayTransactionItem';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RefundService } from './refund.service';
import { ReasonForRefundEnum, iEbayRefunds } from '../model/ebay/transactionsAndRefunds/iEbayRefunds';
import { MatSelectModule } from '@angular/material/select';
import { CurrencyCodeEnum, iEbayRefundItem } from '../model/ebay/transactionsAndRefunds/iEbayRefundItem';


@Component({
  selector: 'app-refund',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, ErrorComponent, MatInputModule, MatIconModule, MatIconModule, MatButtonModule,
  MatSelectModule],
  templateUrl: './refund.component.html',
  styleUrl: './refund.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EbayTransactionsService, RefundService]
})
export class RefundComponent implements OnInit{


  refund_reason = Object.values(ReasonForRefundEnum).filter((val) => typeof val === 'string');
  refundForm: FormGroup;
  act$ = new Observable();
  refund = {} as iRefunds;
  currentTransaction = {} as iEbayTransaction;
  constructor(@Inject(MAT_DIALOG_DATA) public data: iEbayOrder, private readonly dialRef: MatDialogRef<RefundComponent>, public readonly error: ErrorService,
  private readonly transacionsService: EbayTransactionsService, private readonly fb: FormBuilder, private readonly refundService: RefundService ) {
    this.refundForm = this.fb.group({
      orderId: [this.data ?  this.data.orderId : ''],
      creationDate: [new Date(Date.now())],
      reason: [ '', Validators.required],
      comment: ['', Validators.required],
      amount: [0, Validators.required],
      transaction: [{} as iEbayTransaction],
      refund_items: this.fb.array(<iRefundItem[]>[])
    });
  }
  ngOnInit(): void {
    if(!this.data) {
      this.error.message.set('Keine Daten vorhanden');
    }
    this.act$ = this.transacionsService.getTransactionById(this.data.orderId).pipe(tap(res => {
      if(res.id == -1) {
        this.error.newMessage('Transaction wurde nicht gefunden!');
        return;
      }

      this.currentTransaction = res;
      this.refund.orderId = res.orderId;
      this.refund.creationDate = new Date(Date.now());
      this.refund.transaction = res;
      for (let i = 0; i < this.currentTransaction.items.length; i++) {
        this.addRefundItem(this.currentTransaction.items[i]);
      }
      this.refundForm.patchValue({transaction: this.currentTransaction});
    }));
  }
  close(res?: iRefunds[]) {
      this.dialRef.close(res);
  }
  get refund_items() {
    return this.refundForm.controls['refund_items'] as FormArray;
  }

  addRefundItem(transactionItem: iEbayTransactionItem) {

    const item = this.fb.group({
      refund_item: this.refund,
      amount: 0,
      sku: transactionItem.sku,
    })

    this.refund_items.push(item);
  }
  getTitle(_t55: number): any {
    return this.data.lineItems[_t55].title;
  }
  submitRefund() {
    const refund = this.refundForm.value as iRefunds;
    refund.orderId = this.data.orderId;
    const ebayRefund = {} as iEbayRefunds;
    ebayRefund.reasonForRefund = refund.reason as unknown as ReasonForRefundEnum;
    ebayRefund.comment = refund.comment;
    ebayRefund.orderLevelRefundAmount = {
      value : refund.amount.toFixed(2),
      currency : CurrencyCodeEnum.EUR
    };
    let isItem = false;

    for (let i = 0; i < this.refund_items.getRawValue().length; i++) {
      console.log(this.refund_items.getRawValue())
      if(this.refund_items.getRawValue()[i].amount > 0) {
        isItem = true;
        if(ebayRefund.refundItems === undefined)
          ebayRefund.refundItems = [];

        const item : iEbayRefundItem = {} as iEbayRefundItem;
        item.lineItemId = this.data.lineItems[i].lineItemId;
        item.refundAmount = {
          value : this.refund_items.getRawValue()[i].amount.toFixed(2) as "string",
          currency : CurrencyCodeEnum.EUR
        };
        item.legacyReference = {
          legacyItemId : this.data.lineItems[i].legacyItemId,
          legacyTransactionId : this.data.legacyOrderId
        };

        ebayRefund.refundItems.push(item);

      }
    }
    if(!isItem)
      Object(refund).refund_items = undefined;

       this.act$ = this.refundService.createRefund(refund, ebayRefund).pipe(
        map(
          (res) => {
            if(res[0].id) {
              this.close(res);
            }
          }
        )
       );
  }
}
