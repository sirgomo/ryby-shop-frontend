import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ErrorService } from 'src/app/error/error.service';
import { iBestellung } from 'src/app/model/iBestellung';
import { OrdersService } from 'src/app/orders/orders.service';
import { OrderDetailsComponent } from './order-details/order-details.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderComponent {
  oders = toSignal(this.oderService.getBestellungen());
  //oders$= this.oderService.getBestellungen();
  columns: string[] = ['id', 'status','vert', 'bestDate', 'bestellStatus', 'versandnr', 'versArt'];
  constructor(private readonly oderService: OrdersService, public error: ErrorService, private readonly dialog: MatDialog) {}

  openDetailts(item: iBestellung) {
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.width = '50%';
    conf.data = item;
    this.dialog.open(OrderDetailsComponent, conf);
  }
}
