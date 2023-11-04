import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseService } from './warehouse.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { iLager } from 'src/app/model/iLager';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddEditWarehouseComponent } from './add-edit-warehouse/add-edit-warehouse.component';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WarehouseComponent {
  warehouses = toSignal(this.service.warehouses$);
  act$ = new Observable();
  constructor(private readonly service: WarehouseService, private dialog: MatDialog) {}

  newWarehaouseOrEdit(item?: iLager) {
    const conf : MatDialogConfig = new MatDialogConfig();
    conf.height = '50%';
    conf.width = '50%';
    conf.data = item ? item: null;

    this.dialog.open(AddEditWarehouseComponent, conf);
  }
  delete(item: iLager) {
    if(item.id)
    this.act$ = this.service.deleteWarehouse(item.id);
  }
}
