import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { iEbayOrder } from '../model/ebay/orders/iEbayOrder';
import { ErrorService } from '../error/error.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorComponent } from '../error/error.component';
import { EbayTransactionsService } from '../ebay/ebay-transactions/ebay-transactions.service';
import { iEbayTransaction } from '../model/ebay/transactionsAndRefunds/iEbayTransaction';
import { iRefundItem } from '../model/iRefundItem';
import { Observable, tap } from 'rxjs';
import { iRefunds } from '../model/iRefund';
import { iEbayTransactionItem } from '../model/ebay/transactionsAndRefunds/iEbayTransactionItem';

@Component({
  selector: 'app-refund',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, ErrorComponent],
  templateUrl: './refund.component.html',
  styleUrl: './refund.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefundComponent implements OnInit{
  refundForm: FormGroup;
  act$ = new Observable();
  refund = {} as iRefunds;
  currentTransaction = {} as iEbayTransaction;
  constructor(@Inject(MAT_DIALOG_DATA) public data: iEbayOrder, private readonly dialRef: MatDialogRef<RefundComponent>, public readonly error: ErrorService,
  private readonly transacionsService: EbayTransactionsService, private readonly fb: FormBuilder ) {
    this.refundForm = this.fb.group({
      orderId: [this.data ?  this.data.orderId : ''],
      creationDate: [new Date(Date.now())],
      reason: ['', Validators.required],
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
      if(res.id === -1) {
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
  close() {
    this.dialRef.close();
  }
  get refund_items() {
    return this.refundForm.controls['refund_items'] as FormArray;
  }

  addRefundItem(transactionItem: iEbayTransactionItem) {
    const item = this.fb.group({
      refund_item: this.refund,
      amount: 0,
      item: transactionItem,
    })

  }
}
