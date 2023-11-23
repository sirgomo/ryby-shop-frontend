import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { iEbayOrder } from 'src/app/model/ebay/orders/iEbayOrder';
import { toSignal } from '@angular/core/rxjs-interop';
import { EbayTransactionsService } from './ebay-transactions.service';
import { Observable } from 'rxjs';
import { iEbayTransaction } from 'src/app/model/ebay/transactionsAndRefunds/iEbayTransaction';

@Component({
  selector: 'app-ebay-transactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ebay-transactions.component.html',
  styleUrl: './ebay-transactions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EbayTransactionsComponent implements OnInit {
  @Input() item!: iEbayOrder;
  isItem$  = new Observable<iEbayTransaction>();
  constructor(private readonly service: EbayTransactionsService) {}
  ngOnInit(): void {
    this.isItem$ = this.service.getTransactionById(this.item.orderId);
  }
}
