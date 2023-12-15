import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RefundService } from 'src/app/ebay/refund/refund.service';
import { iRefunds } from 'src/app/model/iRefund';
import { ShowRefundComponent } from './show-refund/show-refund.component';

@Component({
  selector: 'app-show-ebay-refunds',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './show-ebay-refunds.component.html',
  styleUrl: './show-ebay-refunds.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowEbayRefundsComponent {

  refundSig = toSignal(this.ebayRefundService.refunds$, { initialValue: []});
  columns = ['order', 'date', 'comm', 'amount', 'items', 'delete'];
  constructor(private readonly ebayRefundService: RefundService, private readonly dialog: MatDialog) {}


  delete(item: iRefunds) {
    if (window) {
      if (window.confirm('Diese Rückerstattung wird nur im Shop gelöscht, aber nicht bei Ebay. Möchten Sie fortfahren?')) {
        this.ebayRefundService.actionSig.set({ item: item, action: 'delete'});
      }
      }
    }
  openRefund(item: iRefunds) {
    const dialogConf: MatDialogConfig = new MatDialogConfig();
    dialogConf.data = item;
    dialogConf.width = '100%';
    dialogConf.height = '100%';

    this.dialog.open(ShowRefundComponent, dialogConf);

  }
}
