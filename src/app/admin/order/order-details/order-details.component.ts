import { Component, Inject, OnInit, Signal, WritableSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs';
import { ErrorService } from 'src/app/error/error.service';
import { BESTELLUNGSSTATE, BESTELLUNGSSTATUS, iBestellung } from 'src/app/model/iBestellung';
import { iColor } from 'src/app/model/iColor';
import { OrdersService } from 'src/app/orders/orders.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  err = this.error.message;
  stan = Object.values(BESTELLUNGSSTATE);
  status = Object.values(BESTELLUNGSSTATUS);
  color: iColor[][] = [];

    currentItem: Signal<iBestellung | undefined> | undefined = this.data.id ? toSignal(this.orderService.getBestellungById(this.data.id).pipe(tap((res) => {
      if(res.id) {
        for (let i = 0; i < res.produkte.length; i++) {
          const item = JSON.parse(res.produkte[i].color);
          this.color.push(item);
        }
      }
    }))) : undefined;
  constructor(private readonly orderService: OrdersService, private readonly dialRef: MatDialogRef<OrderDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data : iBestellung, private error: ErrorService) {}

    ngOnInit(): void {
        if(!this.data) {
          this.error.newMessage('Error - Keine Data vorhanden!')
          return;
        }
    }
    schlissen() {
      this.dialRef.close();
    }
}
