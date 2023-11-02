import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseService } from './warehouse.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { iLager } from 'src/app/model/iLager';

@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WarehouseComponent {
  warehouses = toSignal(this.service.warehouses$);

  constructor(private readonly service: WarehouseService) {}

  newWarehaouseOrEdit(item?: iLager) {

  }
}
