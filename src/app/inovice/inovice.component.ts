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
import { image } from 'html2canvas/dist/types/css/types/image';



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


       let pdf = new jsPDF('p', 'pt', 'a4');
       const leftMargin = 20;
       const pdfWidth = pdf.internal.pageSize.width;
       const pdfHeigh = pdf.internal.pageSize.height;




        html2canvas(item, { allowTaint: true, scale: 1 }).then(canvas => {

          let imgHight = Math.floor(canvas.width * ( pdfHeigh / pdfWidth)) - 2* leftMargin;

          const totalPages = Math.ceil(canvas.height / imgHight);
          console.log(imgHight)
          console.log(pdfHeigh)

          const newCanvas = document.createElement('canvas');
          newCanvas.width = canvas.width
          newCanvas.height = imgHight;
          const ctx = newCanvas.getContext('2d');

          let imgStart = 0;
          pdf.setFontSize(9)
          for (let i = 1; i <= totalPages; i++) {
           if (i > 1)
            pdf.addPage();

            if(ctx !== null) {
              ctx.fillStyle = 'white';
              ctx.fillRect(0,0,canvas.width, imgHight);

              ctx.drawImage(canvas, 0,imgStart,canvas.width ,imgHight, 0,0,pdfWidth - 5 * leftMargin, pdfHeigh - 10* leftMargin);

              pdf.addImage(newCanvas.toDataURL('image/jpeg', 0.95), 'PNG', leftMargin *2, leftMargin *2 , pdfWidth , pdfHeigh,'', 'MEDIUM');
              pdf.text('Page ' + i + ' of ' + totalPages, leftMargin, pdfHeigh - leftMargin);
            }
            imgStart += imgHight;
         //  pdf.addImage(imageData, 'PNG', leftMargin, - (pdfHeigh * i) + leftMargin , canvasImageWidth, canvasImageHeight,'', 'MEDIUM');
          }
          pdf.output('pdfobjectnewwindow');
        })
      }

    }

}
