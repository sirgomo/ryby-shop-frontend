import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, map } from 'rxjs';
import { ProductService } from 'src/app/admin/product/product.service';
import { HelperService } from 'src/app/helper/helper.service';
import { iColor } from 'src/app/model/iColor';
import { iProduct } from 'src/app/model/iProduct';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent implements OnInit, OnDestroy{
  item: iProduct = {} as iProduct;
  act$ = new Observable();
  titleSig = this.helperService.titelSig;
  title = '';
  color: iColor[] = [];
  currentImage!: SafeResourceUrl;
  fotos: string[] = [];
  colorToBuy: iColor[] = [];
  constructor (@Inject(MAT_DIALOG_DATA) public readonly data: iProduct,
  private readonly service: ProductService,
  private helperService: HelperService,
  private santizier: DomSanitizer,
  private snackBar: MatSnackBar
  ) {

    this.titleSig.update((title) => {
      this.title = title;
      if(this.data.kategorie !== undefined)
        return title + ' ' + this.data.kategorie[0].name + ' ' + this.data.name;

      return title + ' ' + this.data.name
     })
  }
  ngOnDestroy(): void {
    this.titleSig.set(this.title);
  }
  ngOnInit(): void {
    this.color = [];
    this.fotos = [];
    if(this.data.id)
    this.act$ = this.service.getProductById(this.data.id).pipe(map((res) => {
      if(res.id) {
        this.item = res;
        this.fotos = JSON.parse(res.foto);

        if(this.fotos.length > 0) {
          let tmpClolor: iColor[] = JSON.parse(res.color);
          let tmpClolor1 = tmpClolor.filter((item) => item.menge > 0);
          this.color = tmpClolor1;
          this.colorToBuy.push({id: this.color[0].id, menge: 0});
          const index = tmpClolor.findIndex((item) => item.id === tmpClolor1[0].id);
          this.getImage(this.fotos[index]);
        }

      }

    }))
  }
  getImage(id: string ) {
    this.act$ = this.service.getImage(id).pipe(map((res) => {
      if(res instanceof Blob)
        this.setImage(res);

      return res;
    }))
  }
  setImage(image: Blob) {
    this.currentImage = this.santizier.bypassSecurityTrustResourceUrl(URL.createObjectURL(image));
  }
  getPriceNetto(item: iProduct) {
    return this.item.preis.toString();
  }
  getPriceBrutto(item: iProduct) {
    const mwst = Number(item.preis) * item.mehrwehrsteuer / 100;
    return (Number(item.preis) + mwst).toFixed(2);
  }
  changeImage(index: number) {
    this.getImage(this.fotos[index]);
    if(this.colorToBuy.length <= 1)
    this.colorToBuy[0] = ({id: this.color[index].id, menge: 0});
  }
  addColor(index: string, event: any) {
      if(event.checked === true) {
        this.colorToBuy.push({id: index, menge: 0});
      } else {
        if(this.colorToBuy.length > 1) {
          const removeIndex = this.colorToBuy.findIndex(item => item.id === index);
          this.colorToBuy.splice(removeIndex, 1);
        }

      }
  }

  addItem(item: iProduct) {
    item.color = JSON.stringify(this.colorToBuy);
    const items = this.helperService.cardSig();
    const newItems = items.slice(0);
    newItems.push(item);
    this.helperService.cardSig.set(newItems);

     this.snackBar.open(item.name + ' wurde zum Warenkorb hinzugefügt!', 'Ok', { duration: 1500 });


  }
}

