import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { OrderRefundsService } from './order-refunds.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { iBestellung } from 'src/app/model/iBestellung';
import { ErrorService } from 'src/app/error/error.service';
import { ErrorComponent } from 'src/app/error/error.component';
import { MatCardModule } from '@angular/material/card';
import { iProductBestellung } from 'src/app/model/iProductBestellung';
import { RUECKGABESTATUS, iProduktRueckgabe } from 'src/app/model/iProduktRueckgabe';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { OrdersService } from 'src/app/orders/orders.service';
import { MatTableModule } from '@angular/material/table';
import { toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, Observable, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-order-refunds',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule, MatInputModule, ErrorComponent, MatCardModule, MatSelectModule, MatCheckboxModule,
  MatTableModule],
  templateUrl: './order-refunds.component.html',
  styleUrl: './order-refunds.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderRefundsComponent implements OnInit {

  refund: FormGroup;
  status = Object.values(RUECKGABESTATUS).filter((tmp) => typeof tmp === 'string');
  currentRefund : iProduktRueckgabe = {} as iProduktRueckgabe;
  produktTable = ['color', 'name', 'price', 'menge', 'refund'];
  act$ = new Observable();
  bestellungSig = toSignal(this.data.id ? this.orderService.getBestellungById(this.data.id).pipe(
    tap((res) => {
      this.currentRefund.kunde = res.kunde;
      this.currentRefund.bestellung = res;//{id: res.id} as iBestellung;
    })
  ): EMPTY);
  constructor (private readonly refundService: OrderRefundsService, @Inject(MAT_DIALOG_DATA) private readonly data: iBestellung, private readonly dialogRef: MatDialogRef<OrderRefundsComponent>,
  public readonly errorService: ErrorService, private readonly fb : FormBuilder, private readonly orderService: OrdersService, private readonly snack: MatSnackBar) {
    this.refund = this.fb.group ({
      produkte: this.fb.array([]),
      rueckgabegrund: [this.data.refunds[0] ? this.data.refunds[0].rueckgabegrund : '', Validators.required],
      rueckgabestatus: [this.data.refunds[0] ? this.data.refunds[0].rueckgabestatus : '', Validators.required],
      paypal_refund_id: [this.data.refunds[0] ? this.data.refunds[0].paypal_refund_id :''],
      amount: [this.data.refunds[0] ? this.data.refunds[0].amount : 0],
      corrective_refund_nr: [{value: this.data.refunds[0] ? this.data.refunds[0].id : undefined, disabled: true}],
      is_corrective: [0, Validators.required]
    })
    if(this.data.refunds[0] && this.data.refunds[0].produkte) {
      for (let i = 0; i < this.data.refunds[0].produkte.length; i++) {
        this.addProdukt(this.data.refunds[0].produkte[i]);
      }
    }
  }
  ngOnInit(): void {
    this.currentRefund.bestellung = this.data;
    this.currentRefund.is_corrective = 0;

  }

  get produkte() {
    return this.refund.controls['produkte'] as FormArray;
  }

  addProdukt(prod: iProductBestellung) {
    const produktForm = this.fb.group({
      //produkt: [prod.produkt],
      menge: [0, Validators.required],
      color: [prod.color, Validators.required],
      verkauf_price: [prod.verkauf_price  !== 0 ? prod.verkauf_price : 0, Validators.required]
    });

    this.produkte.push(produktForm);
  }
  removeProdukt(index: number) {
    this.produkte.removeAt(index);
  }
  saveRefund() {
    Object.assign(this.currentRefund, this.refund.value);
    this.currentRefund.bestellung.paypal_order_id = this.currentRefund.paypal_refund_id;
    this.currentRefund.paypal_refund_id = '';
    if(this.currentRefund.is_corrective) {
      if(this.currentRefund.id) {
        this.currentRefund.corrective_refund_nr = this.currentRefund.id;
        this.currentRefund.id = undefined;
      } else {
       this.snack.open('Es gibt kein id für der Refund!', 'Ok', {duration: 2500 });
       this.refund;
      }

    }

    this.act$ = this.refundService.createRefund(this.currentRefund).pipe(tap(() => {
      this.dialogRef.close();
    }))
  }
  cancel() {
    this.dialogRef.close();
  }
  isCorrective() {
    this.currentRefund.is_corrective = this.refund.get('is_corrective')?.getRawValue();
  }


}

