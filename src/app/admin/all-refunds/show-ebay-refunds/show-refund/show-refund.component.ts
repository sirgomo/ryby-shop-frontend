import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { iRefunds } from 'src/app/model/iRefund';

@Component({
  selector: 'app-show-refund',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './show-refund.component.html',
  styleUrl: './show-refund.component.scss'
})
export class ShowRefundComponent implements OnInit{
  refund = signal<iRefunds | null>(null);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {

  }
  ngOnInit(): void {
    this.refund.set(this.data);
  }
}
