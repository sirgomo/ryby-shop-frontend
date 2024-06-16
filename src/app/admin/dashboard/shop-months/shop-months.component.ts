import { Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardService } from '../dashboard.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-shop-months',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './shop-months.component.html',
  styleUrl: './shop-months.component.scss'
})
export class ShopMonthsComponent {
  public barChartLegend = true;
  public barChartPlugins = [];
  //public barChartData: ChartConfiguration<'bar'>['data']
  public barChartData = toSignal(this.service.getMonthData(), { initialValue: {} as any}) as any;

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
  };
  constructor(private readonly service: DashboardService) {}
}
