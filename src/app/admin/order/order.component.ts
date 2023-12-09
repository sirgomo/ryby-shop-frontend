import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ErrorService } from 'src/app/error/error.service';
import { iBestellung } from 'src/app/model/iBestellung';
import { OrdersService } from 'src/app/orders/orders.service';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { InoviceComponent } from 'src/app/inovice/inovice.component';
import { HelperService } from 'src/app/helper/helper.service';
import { CommonModule } from '@angular/common';
import { OrderSelectorComponent } from './order-selector/order-selector.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderRefundsComponent } from './order-refunds/order-refunds.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, OrderSelectorComponent, MatTableModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule]
})
export class OrderComponent implements OnDestroy{


  ordersSig = this.oderService.ordersSig;

  columns: string[] = ['id', 'status','vert', 'bestDate', 'bestellStatus','rausDate', 'versandnr', 'versArt', 'inovice', 'refund'];
  constructor(private readonly oderService: OrdersService, public error: ErrorService, private readonly dialog: MatDialog, private helperService: HelperService) {}
  ngOnDestroy(): void {
    this.helperService.artikelProSiteSig.set(0);
  }

  openDetailts(item: iBestellung) {
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.width = '80%';
    conf.minHeight = '80%';
    conf.data = item;
    this.dialog.open(OrderDetailsComponent, conf);
  }
  openInovice(item: iBestellung) {
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.height = '100%';
    conf.width = '100%';
    conf.data = item;
    this.dialog.open(InoviceComponent, conf);
  }
  refund(order: iBestellung) {
    const conf : MatDialogConfig = new MatDialogConfig();
    conf.width = '100%';

    conf.data = order;

    this.dialog.open(OrderRefundsComponent, conf);
    }
  getWertMinRefunds(best: iBestellung) {
    let wert = 0;
    for (let i = 0; i < best.refunds.length; i++) {
      wert += +best.refunds[i].amount;
      if(best.refunds[i].produkte)
      for (let j = 0; j < best.refunds[i].produkte.length; j++) {
        wert += +best.refunds[i].produkte[j].verkauf_price;
      }
    }
    return best.gesamtwert + ' (-'+ wert.toFixed(2) + ') ';
  }
}
