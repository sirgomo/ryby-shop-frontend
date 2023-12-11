import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { OrderRefundsService } from '../order/order-refunds/order-refunds.service';
import { ErrorComponent } from 'src/app/error/error.component';
import { ErrorService } from 'src/app/error/error.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { HelperService } from 'src/app/helper/helper.service';
import { PaginatorComponent } from 'src/app/paginator/paginator.component';
import { ProductsQuanitySelectorComponent } from 'src/app/products/products-quanity-selector/products-quanity-selector.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-all-refunds',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatTableModule, ErrorComponent, PaginatorComponent, ProductsQuanitySelectorComponent, MatButtonModule, MatIconModule],
  templateUrl: './all-refunds.component.html',
  styleUrl: './all-refunds.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllRefundsComponent implements OnInit {
  refundsSig = toSignal(this.shopRefService.refunds$, { initialValue: []});
  columns = ['orderId', 'refundId','amount','itemCount', 'corrective_nr','paypalid', 'paypalstatus', 'delete']
    constructor(private readonly shopRefService: OrderRefundsService, public errorService: ErrorService, private helperService: HelperService) {}
  ngOnInit(): void {
}
}
