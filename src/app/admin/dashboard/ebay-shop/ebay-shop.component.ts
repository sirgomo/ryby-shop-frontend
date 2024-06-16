import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-ebay-shop',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './ebay-shop.component.html',
  styleUrl: './ebay-shop.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EbayShopComponent {
    pieChartOptions: ChartOptions<'pie'> = {
      responsive: true,
    };
    pieChartLabels = [['Ebay', 'Sales' ], [ 'In', 'Store', 'Sales' ] ];
    pieChartDatasets =  this.service.ebayshopdataSig;
    pieChartLegend = true;
    pieChartPlugins = [];

    constructor(private readonly service: DashboardService) {}
}
