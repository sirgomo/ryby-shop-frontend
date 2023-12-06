import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { OrderRefundsService } from './order-refunds.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { iBestellung } from 'src/app/model/iBestellung';
import { ErrorService } from 'src/app/error/error.service';
import { ErrorComponent } from 'src/app/error/error.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-order-refunds',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule, MatInputModule, ErrorComponent, MatCardModule],
  templateUrl: './order-refunds.component.html',
  styleUrl: './order-refunds.component.scss'
})
export class OrderRefundsComponent {

  constructor (private readonly refundService: OrderRefundsService, @Inject(MAT_DIALOG_DATA) private readonly data: iBestellung, private readonly dialogRef: MatDialogRef<OrderRefundsComponent>,
  public readonly errorService: ErrorService) {}

  saveRefund() {
    throw new Error('Method not implemented.');
    }
}
