import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChartOptions } from 'chart.js';
import { DashboardService } from '../dashboard.service';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-shop-netto',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './shop-netto.component.html',
  styleUrl: './shop-netto.component.scss'
})
export class ShopNettoComponent {
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };
  pieChartLabels = [['Store', 'sales' ], [ 'Store', 'Shipping'  ], [ 'Store', 'Netto'] ];
  pieChartDatasets =  toSignal(this.service.getStoreNettoData(), { initialValue: [{ data: [] }]} ); 
  pieChartLegend = true;
  pieChartPlugins = [];
  constructor(private readonly service: DashboardService) {}
}
