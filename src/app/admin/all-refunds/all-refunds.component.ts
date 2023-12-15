import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { OrderRefundsService } from '../order/order-refunds/order-refunds.service';
import { ErrorComponent } from 'src/app/error/error.component';
import { ErrorService } from 'src/app/error/error.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { PaginatorComponent } from 'src/app/paginator/paginator.component';
import { ProductsQuanitySelectorComponent } from 'src/app/products/products-quanity-selector/products-quanity-selector.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { OrderRefundsComponent } from '../order/order-refunds/order-refunds.component';
import { iProduktRueckgabe } from 'src/app/model/iProduktRueckgabe';
import { ShowEbayRefundsComponent } from './show-ebay-refunds/show-ebay-refunds.component';

@Component({
  selector: 'app-all-refunds',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatTableModule, ErrorComponent, PaginatorComponent, ProductsQuanitySelectorComponent, MatButtonModule, MatIconModule, ShowEbayRefundsComponent],
  templateUrl: './all-refunds.component.html',
  styleUrl: './all-refunds.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllRefundsComponent  implements OnInit{
  refundsSig = toSignal(this.shopRefService.refunds$, { initialValue: []});
  columns = ['orderId', 'refundId','amount','itemCount', 'ground', 'date', 'corrective_nr','paypalid', 'paypalstatus', 'delete']
    constructor(private readonly shopRefService: OrderRefundsService, public errorService: ErrorService,
      private readonly dialog: MatDialog) {}
  ngOnInit(): void {
    this.shopRefService.actionsSig.set({ item: null, action: 'getall'});
  }

    delete(item: iProduktRueckgabe) {
      this.shopRefService.actionsSig.set({ item: item, action: 'delete'})
    }
  add_correctur(item: iProduktRueckgabe) {

      const conf : MatDialogConfig = new MatDialogConfig();
      conf.width = '100%';
      item.bestellung.refunds = [item];
      conf.data = item.bestellung;

      this.dialog.open(OrderRefundsComponent, conf);

  }
}
