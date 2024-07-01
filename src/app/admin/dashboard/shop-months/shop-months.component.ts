import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardService } from '../dashboard.service';
import { ActiveElement } from 'chart.js/dist/plugins/plugin.tooltip';
import { EbayDetailsComponent } from './ebay-details/ebay-details.component';
import { ShopDetailsComponent } from './shop-details/shop-details.component';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-shop-months',
  standalone: true,
  imports: [BaseChartDirective, EbayDetailsComponent, ShopDetailsComponent, MatDialogModule],
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
    },
    onClick: (event, elements, chart) => {
      //ebay
      if(elements[0].datasetIndex === 0) {
      const conf = new MatDialogConfig();
      conf.minHeight = '100%';
      conf.minWidth = '100%';
      conf.panelClass = 'contentDialog';
      conf.data = { 'year': this.service.courrentYearSig(), 'month': elements[0].index };

      this.dialog.open(EbayDetailsComponent, conf);
    
      } else {
        const conf = new MatDialogConfig();
        conf.minHeight = '100%';
        conf.minWidth = '100%';
        conf.panelClass = 'contentDialog';
        conf.data = { 'year': this.service.courrentYearSig(), 'month': elements[0].index };
  
        this.dialog.open(ShopDetailsComponent, conf);
      } 
    },
  };
  constructor(private readonly service: DashboardService, private readonly dialog: MatDialog) {}




}
