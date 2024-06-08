import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { OrdersService } from './orders.service';
import { HelperService } from '../helper/helper.service';
import { ErrorService } from '../error/error.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { iBestellung } from '../model/iBestellung';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { InoviceComponent } from '../inovice/inovice.component';
import { OrderSelectorComponent } from '../admin/order/order-selector/order-selector.component';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { PaginatorComponent } from '../paginator/paginator.component';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [OrderSelectorComponent, MatTableModule, CommonModule, MatIconModule, MatProgressSpinnerModule, MatButtonModule, PaginatorComponent]
})
export class OrdersComponent implements OnInit{

  columns: string[] = ['id', 'status','vert', 'bestDate', 'bestellStatus','rausDate', 'versandnr', 'versArt', 'inovice'];
  orders = toSignal(this.orderService.bestellungen.asObservable() );
  constructor (private readonly orderService: OrdersService, private readonly helper: HelperService,
    public readonly error: ErrorService, private dialog: MatDialog) {}
  ngOnInit(): void {
    lastValueFrom(this.orderService.items$)
  }

    openInovice(item: iBestellung) {
      const conf: MatDialogConfig = new MatDialogConfig();
      conf.height = '100%';
      conf.minWidth = '100%';
      conf.width = '100%';
      conf.data = item;
      this.dialog.open(InoviceComponent, conf);
      }

}
