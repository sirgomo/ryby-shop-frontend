import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ErrorService } from 'src/app/error/error.service';
import { iBestellung } from 'src/app/model/iBestellung';
import { OrdersService } from 'src/app/orders/orders.service';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { InoviceComponent } from 'src/app/inovice/inovice.component';
import { CommonModule } from '@angular/common';
import { OrderSelectorComponent } from './order-selector/order-selector.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderRefundsComponent } from './order-refunds/order-refunds.component';
import { PaginatorComponent } from 'src/app/paginator/paginator.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { ShowShippingComponent } from './show-shipping/show-shipping.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, OrderSelectorComponent, MatTableModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, PaginatorComponent]
})
export class OrderComponent  {


  ordersSig = toSignal(this.oderService.items$);

  columns: string[] = ['id', 'status','vert', 'bestDate', 'bestellStatus','rausDate', 'versandnr', 'versArt','shipp', 'inovice', 'refund'];
  constructor(private readonly oderService: OrdersService, public error: ErrorService, public readonly dialog: MatDialog) {}


  openDetailts(item: iBestellung) {
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.width = '100%';
    conf.minHeight = '100%';
    conf.data = item;
    this.dialog.open(OrderDetailsComponent, conf);
  }
  openInovice(item: iBestellung) {
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.height = '100%';
    conf.width = '100%';
    conf.minWidth = '100%';
    conf.data = item;
    this.dialog.open(InoviceComponent, conf);
  }
  refund(order: iBestellung) {
    const conf : MatDialogConfig = new MatDialogConfig();
    conf.width = '100%';
    conf.minWidth = '100%';
    order.refunds = [];
    conf.data = order;

    this.dialog.open(OrderRefundsComponent, conf);
    }
  getWertMinRefunds(best: iBestellung) {
    let wert = 0;
    for (let i = 0; i < best.refunds.length; i++) {
      wert += Number(best.refunds[i].amount);
      if(best.refunds[i].produkte)
      for (let j = 0; j < best.refunds[i].produkte.length; j++) {
        wert += Number(best.refunds[i].produkte[j].verkauf_price);
      }
    }
    return best.gesamtwert + ' (-'+ wert.toFixed(2) + ') ';
  }
  showShippingAddres(best: iBestellung) {
    const conf: MatDialogConfig = new MatDialogConfig();

    conf.data = JSON.parse(best.shipping_address_json);
    this.dialog.open(ShowShippingComponent, conf);
  }
}
