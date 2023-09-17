import { Component } from '@angular/core';
import { OrdersService } from './orders.service';
import { HelperService } from '../helper/helper.service';
import { ErrorService } from '../error/error.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { iBestellung } from '../model/iBestellung';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { InoviceComponent } from '../inovice/inovice.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent {

  columns: string[] = ['id', 'status','vert', 'bestDate', 'bestellStatus','rausDate', 'versandnr', 'versArt', 'inovice'];
  #userid = Number(localStorage.getItem('userid'));
  orders = toSignal( this.orderService.getBestellungBeiKundeNr(this.#userid));
  constructor (private readonly orderService: OrdersService, private readonly helper: HelperService,
    public readonly error: ErrorService, private dialog: MatDialog) {}

    openInovice(item: iBestellung) {
      const conf: MatDialogConfig = new MatDialogConfig();
      conf.width = '210mm';
      conf.maxWidth = '210mm'
      conf.height = '90%';
      conf.data = item;
      this.dialog.open(InoviceComponent, conf);
      }

}
