import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-ebay-netto',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './ebay-netto.component.html',
  styleUrl: './ebay-netto.component.scss'
})
export class EbayNettoComponent {
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
  pieChartLabels = [['Ebay' ], [ 'Shipping' ],['MwSt'], ['Gewin'] ];
  pieChartDatasets =  this.service.ebayNettoDataSig;
  pieChartLegend = true;
  pieChartPlugins = [];
  constructor(private readonly service: DashboardService) {}
}
