import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { DashboardService } from '../dashboard.service';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-shop-netto',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './shop-netto.component.html',
  styleUrl: './shop-netto.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopNettoComponent {
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 12 // Zmniejsz rozmiar czcionki
          },
          boxWidth: 10,
        },
        position: 'top',
        align: 'start',
      }
    }
  };
  pieChartLabels = [['Sales' ], ['Shipping'  ],['MwSt'],['Ware'], [ 'Netto'] ];
  pieChartDatasets = this.service.storeNettoDataSig;
  pieChartLegend = true;
  pieChartPlugins = [];
  constructor(private readonly service: DashboardService) {}
}
