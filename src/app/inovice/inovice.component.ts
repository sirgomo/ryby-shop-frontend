import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { iBestellung } from '../model/iBestellung';
import { OrdersService } from '../orders/orders.service';
import { Observable, forkJoin, tap } from 'rxjs';
import { ErrorService } from '../error/error.service';
import { CompanyService } from '../admin/company/company.service';
import { iCompany } from '../model/iCompany';
import { iColor } from '../model/iColor';


@Component({
  selector: 'app-inovice',
  templateUrl: './inovice.component.html',
  styleUrls: ['./inovice.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InoviceComponent {
  itemid = this.data.id ? this.data.id : 0;
  currentItem: iBestellung = {} as iBestellung;
  company: iCompany = {} as iCompany;
  item$ = forkJoin([this.orderService.getBestellungById(this.itemid), this.companyService.getAllCompanies()]).pipe(tap(([best, comp]) => {
    this.currentItem = best;
    this.company = comp[0];
  }));
  columns: string[] = ['pos', 'name','varia', 'preis', 'menge', 'netto', 'rabat', 'brutto'];
    constructor(@Inject(MAT_DIALOG_DATA) public data: iBestellung, private readonly dialoRef: MatDialogRef<InoviceComponent>, private orderService: OrdersService,
    public errorService: ErrorService, private companyService: CompanyService){}

    getNetto(index: number): number {
      return this.currentItem.produkte[index].verkauf_price * this.currentItem.produkte[index].menge;
    }
    getBrutto(index: number): number {
      return (this.currentItem.produkte[index].verkauf_price + this.currentItem.produkte[index].verkauf_steuer)  * this.currentItem.produkte[index].menge;
    }
    getTotalNetto(): number {
      let netto = 0;
      for (let i = 0; i < this.currentItem.produkte.length; i++) {
        netto += this.getNetto(i);
      }
      return Number(netto.toFixed(2));
    }
    getTotalBrutto(): number {
      let brutto = 0;
      for (let i = 0; i < this.currentItem.produkte.length; i++) {
        brutto += this.getBrutto(i);
      }
      return brutto;
    }
    getRabat(index: number) : number {
      return this.currentItem.produkte[index].verkauf_rabat * this.currentItem.produkte[index].menge;
    }
    getTotalRabat(): number {
      let rabat = 0;
      for (let i = 0; i < this.currentItem.produkte.length; i++) {
        rabat += this.getRabat(i);
      }
      return rabat;
    }

    getVariations(index: number): iColor[] {
        return JSON.parse( this.currentItem.produkte[index].color);
    }
    close() {
      this.dialoRef.close();
    }

}
