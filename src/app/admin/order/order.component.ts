import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ErrorService } from 'src/app/error/error.service';
import { iBestellung } from 'src/app/model/iBestellung';
import { OrdersService } from 'src/app/orders/orders.service';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { InoviceComponent } from 'src/app/inovice/inovice.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderComponent {
  oders = this.oderService.ordersSig;
  //oders$= this.oderService.getBestellungen();
  columns: string[] = ['id', 'status','vert', 'bestDate', 'bestellStatus','rausDate', 'versandnr', 'versArt', 'inovice'];
  constructor(private readonly oderService: OrdersService, public error: ErrorService, private readonly dialog: MatDialog) {}

  openDetailts(item: iBestellung) {
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.width = '80%';
    conf.minHeight = '80%';
    conf.data = item;
    this.dialog.open(OrderDetailsComponent, conf);
  }
  openInovice(item: iBestellung) {
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.width = '90%';
    conf.height = '90%';
    conf.data = item;
    this.dialog.open(InoviceComponent, conf);
  }
}
