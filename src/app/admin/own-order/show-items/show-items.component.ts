import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTable, MatTableModule } from '@angular/material/table';
import { ErrorService } from 'src/app/error/error.service';
import { iProduct } from 'src/app/model/iProduct';
import { CompanyService } from '../../company/company.service';
import { firstValueFrom } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-show-items',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './show-items.component.html',
  styleUrl: './show-items.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowItemsComponent implements OnInit {
@Input() currentProducs: iProduct[] = [];
@Output() index = new EventEmitter<number>();
@ViewChild(MatTable) table!: MatTable<any>
columns = signal(['sku', 'name','quantity', 'price', 'mwst','total', 'remove']);
  constructor(private readonly erroService: ErrorService, private readonly companyService: CompanyService){

  }
  ngOnInit(): void {
    firstValueFrom(this.companyService.getCompanyById(1)).then((res) => {
      if(res.isKleinUnternehmen === 1) {
        this.columns.set(['sku', 'name','quantity', 'price','total', 'remove']);
      }
    })
  }
  getItemPriceBrutto(index: number) {
    if(!this.currentProducs[index])
      return 0;

    return ((this.currentProducs[index].variations[0].price + (this.currentProducs[index].variations[0].price * this.currentProducs[index].mehrwehrsteuer / 100))
    * this.currentProducs[index].variations[0].quanity);
  }
  getTotalBrutto() {
    let brutto = 0;
    for (let i = 0; i < this.currentProducs.length; i++) {
      brutto += Number(this.getItemPriceBrutto(i));
    }
  return brutto;
  }
  getTotal() {
    let totalNetto = 0;
    for (let i = 0; i < this.currentProducs.length; i++) {
      totalNetto += this.currentProducs[i].variations[0].price * this.currentProducs[i].variations[0].quanity;
    }
    return totalNetto;
  }
  removeItem(index: number) {
    if(this.currentProducs[index])
      this.index.emit(index);

      this.table.renderRows();
  }
  getMwst(index: number) {
    if(this.currentProducs[index])
    return (this.currentProducs[index].variations[0].price * this.currentProducs[index].mehrwehrsteuer / 100);

    return 0
  }
  getPreis(index: number) {
    if(this.currentProducs[index])
      return this.currentProducs[index].variations[0].price;
    return 0;
  }
  getQuantity(index: number) {
    if(this.currentProducs[index])
    return this.currentProducs[index].variations[0].quanity;

    return 0;
  }
  getSku(index: number) {
    if(this.currentProducs[index])
      return this.currentProducs[index].variations[0].sku;

    return 0;
  }
  save() {
    this.index.emit(-1);
  }
  clearItems() {
    this.index.emit(-2);
    this.table.renderRows();
  }
}
