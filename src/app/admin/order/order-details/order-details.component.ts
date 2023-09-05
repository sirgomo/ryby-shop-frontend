import { Component, Inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorService } from 'src/app/error/error.service';
import { iBestellung } from 'src/app/model/iBestellung';
import { OrdersService } from 'src/app/orders/orders.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  err = this.error.message;
  item = signal<iBestellung>({} as iBestellung);
  constructor(private readonly orderService: OrdersService, private readonly dialRef: MatDialogRef<OrderDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data : iBestellung, private error: ErrorService) {}

    ngOnInit(): void {
        if(!this.data) {
          this.error.newMessage('Error - Keine Data vorhanden!')
          return;
        }
        if(this.data.id)
          this.item = toSignal(this.orderService.getBestellungById(this.data.id));

    }
}
