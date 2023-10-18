import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit, Signal, WritableSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map, of, tap } from 'rxjs';
import { ErrorComponent } from 'src/app/error/error.component';
import { ErrorService } from 'src/app/error/error.service';
import { BESTELLUNGSSTATE, BESTELLUNGSSTATUS, iBestellung } from 'src/app/model/iBestellung';
import { OrdersService } from 'src/app/orders/orders.service';


@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ErrorComponent, MatFormFieldModule, MatIconModule, MatDatepickerModule, MatInputModule, MatSelectModule, FormsModule, ReactiveFormsModule,
  CommonModule, MatProgressSpinnerModule, MatMomentDateModule, MatButtonModule, MatDialogModule]
})
export class OrderDetailsComponent implements OnInit {
  err = this.error.message;
  stan = Object.values(BESTELLUNGSSTATE);
  status = Object.values(BESTELLUNGSSTATUS);

  act$ = new Observable();

    currentItem: Signal<iBestellung | undefined>  = this.data.id ? toSignal(this.orderService.getBestellungById(this.data.id).pipe(map((res) => {
      if(res.id) {

      }
      return {} as iBestellung;
    }))) : toSignal(of({} as iBestellung));
  constructor(private readonly orderService: OrdersService, private readonly dialRef: MatDialogRef<OrderDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data : iBestellung, private error: ErrorService,
    private readonly snackBar: MatSnackBar) {}

    ngOnInit(): void {
        if(!this.data) {
          this.error.newMessage('Error - Keine Data vorhanden!')
          return;
        }
    }
    close() {
      this.dialRef.close();
    }
    saveOrder() {
      const item: iBestellung | undefined = this.currentItem();

      if(item !== undefined) {
        Object.assign(item, this.data);

        for (let i = 0; i < item.produkte.length; i++) {

        }
        this.act$ = this.orderService.updateOrder(item).pipe(tap(res => {
          if(!res.id)
          {
            this.snackBar.open('Etwas ist schieffgelaufen, Bestellung wurde nicht gespeichert', 'Ok', { duration: 2000 })
            return;
          }
          this.snackBar.open('Bestellung gespiechert', '', { duration: 1500 })
        }));
      }


    }
}
