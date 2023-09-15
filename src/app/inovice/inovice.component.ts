import { ChangeDetectionStrategy, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { iBestellung } from '../model/iBestellung';
import { OrdersService } from '../orders/orders.service';
import { forkJoin, tap } from 'rxjs';
import { ErrorService } from '../error/error.service';
import { CompanyService } from '../admin/company/company.service';
import { iCompany } from '../model/iCompany';
import { iColor } from '../model/iColor';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';



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
  columns: string[] = [ 'name','varia','rabat', 'stpreis', 'mwst', 'preis', 'brutto'];
  item$ = forkJoin([this.orderService.getBestellungById(this.itemid), this.companyService.getAllCompanies()]).pipe(tap(([best, comp]) => {
    this.currentItem = best;
    this.company = comp[0];
    this.isPromotion();

  }));


    constructor(@Inject(MAT_DIALOG_DATA) public data: iBestellung, private readonly dialoRef: MatDialogRef<InoviceComponent>, private orderService: OrdersService,
    public errorService: ErrorService, private companyService: CompanyService){}

  private isPromotion() {
    let isPromoted = false;
    for (let i = 0; i < this.currentItem.produkte.length; i++) {
      if (this.currentItem.produkte[i].produkt[0].promocje && this.currentItem.produkte[i].produkt[0].promocje[0].id)
        true;
    }
    if (!isPromoted && this.company.isKleinUnternehmen) {
      this.columns = [ 'name','varia','stpreis', 'brutto'];
    } else if ( !isPromoted && !this.company.isKleinUnternehmen) {
      this.columns = [ 'name','varia', 'stpreis', 'mwst', 'preis', 'brutto'];
    } else if (isPromoted && this.company.isKleinUnternehmen ) {
     this.columns = [ 'name','varia','rabat', 'stpreis',  'brutto'];
    } else {
      this.columns = [ 'name','varia','rabat', 'stpreis', 'mwst', 'preis', 'brutto'];
    }

  }
    getTaxProStuck(index: number) {
      return this.currentItem.produkte[index].verkauf_steuer;
    }
    getTax() {
      let taxx = 0;
      for (let i = 0; i < this.currentItem.produkte.length; i++ ) {
        taxx += this.getTaxProStuck(i) * this.currentItem.produkte[i].menge;
      }
      return taxx.toFixed(2);
    }
    getNetto(index: number): number {
      return Number(this.currentItem.produkte[index].verkauf_price) * this.currentItem.produkte[index].menge;
    }
    getBrutto(index: number) {

      return ((Number(this.currentItem.produkte[index].verkauf_price) + Number(this.currentItem.produkte[index].verkauf_steuer))  * this.currentItem.produkte[index].menge).toFixed(2);
    }
    getTotalNetto(): number {
      let netto = 0;
      for (let i = 0; i < this.currentItem.produkte.length; i++) {
        netto += this.getNetto(i);
      }
      return Number(netto.toFixed(2));
    }
    getTotalBrutto(): number {
      return Number((this.getTotalNetto() + Number(this.getTax())).toFixed(2));
    }
    getRabat(index: number) : number {
      return Number(this.currentItem.produkte[index].verkauf_rabat) * this.currentItem.produkte[index].menge;
    }
    getTotalRabat() {
      let rabat = 0;
      for (let i = 0; i < this.currentItem.produkte.length; i++) {
        rabat += this.getRabat(i);
      }
      return rabat.toFixed(2);
    }
    getPriceWithShipping() {
      return (Number(this.currentItem.versandprice) + this.getTotalBrutto()).toFixed(2);
    }
    getVariations(index: number): iColor[] {
        return JSON.parse( this.currentItem.produkte[index].color);
    }
    close() {
      this.dialoRef.close();
    }
    savePdf() {
      const item = document.getElementById('invoice');
      if(item) {
       const htmlWidth = item.clientWidth;
       const htmlHeight = item.clientHeight;

       const leftMargin = 50;
       const pdfWidth = htmlWidth + (leftMargin *2);
       const pdfHeigh = (pdfWidth * 1.5) + (leftMargin *2);
        const canvasImageWidth = htmlWidth;
        const canvasImageHeight = htmlHeight;

        const totalPages = Math.ceil(htmlHeight / pdfHeigh) -1;

        html2canvas(item, { allowTaint: true, scale: 2 }).then(canvas => {
          canvas.getContext('2d');
          const imageData = canvas.toDataURL('image/jpeg', 1.0);
          let pdf = new jsPDF('p', 'pt', [pdfWidth, pdfHeigh]);

          pdf.addImage(imageData, 'PNG', leftMargin, leftMargin, canvasImageWidth, canvasImageHeight,'', 'MEDIUM');

          for (let i = 1; i <= totalPages; i++) {
           pdf.addPage([pdfWidth, pdfHeigh], 'p');
           pdf.addImage(imageData, 'PNG', leftMargin, - (pdfHeigh * i) + leftMargin , canvasImageWidth, canvasImageHeight,'', 'MEDIUM');
          }
          pdf.output('pdfobjectnewwindow');
        })
      }

    }

}
