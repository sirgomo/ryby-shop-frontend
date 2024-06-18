import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardService } from '../dashboard.service';


@Component({
  selector: 'app-shop-months',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './shop-months.component.html',
  styleUrl: './shop-months.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopMonthsComponent {
  public barChartLegend = true;
  public barChartPlugins = [];
  barChartData = this.service.monthDataSig;

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 12 // Zmniejsz rozmiar czcionki
          },
          boxWidth: 10,
        },
        position: 'top',
        align: 'center',
      }
    }
  };
  constructor(private readonly service: DashboardService) {}
}
