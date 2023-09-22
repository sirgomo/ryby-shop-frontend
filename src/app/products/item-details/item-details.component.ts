import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
  styleUrls: ['./item-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatFormFieldModule, CommonModule, MatIconModule, MatButtonModule, MatCheckboxModule, MatProgressSpinnerModule, MatInputModule, FormsModule]
})
export class ItemDetailsComponent implements OnInit, OnDestroy{
  @ViewChildren(MatCheckbox) checks! : MatCheckbox[];
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
  private snackBar: MatSnackBar,
  private dialogRef: MatDialogRef<ItemDetailsComponent>
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
    this.checkChekboxes(index);
    this.getImage(this.fotos[index]);
    if(this.colorToBuy.length <= 1)
    this.colorToBuy[0] = ({id: this.color[index].id, menge: 0});
  }
  checkChekboxes(index: number) {
    this.checks.forEach((item, ind) => {
      if(ind !== index) {
        item['checked'] = false;
      } else {
        item['checked'] = true;
      }

    })
  }
  addColor(index: string, event: any) {
      if(event.checked === true) {
        this.colorToBuy.push({id: index, menge: 0});
      } else {

          const removeIndex = this.colorToBuy.findIndex(item => item.id === index);
          this.colorToBuy.splice(removeIndex, 1);


      }
  }

  addItem(item: iProduct) {
    if(this.colorToBuy.length < 1) {
      this.snackBar.open('Es gibt nichts, was ich dem Warenkorb hinzufügen könnte.', 'Ok', { duration: 2000 })
      return;
    }
    const tmpItem= {} as iProduct;
    Object.assign(tmpItem, item);

    if(!this.doWeHaveEnough(item))
      return;

      this.helperService.cardSigForMengeControl().push(tmpItem);
    item.color = JSON.stringify(this.colorToBuy);
    const items = this.helperService.cardSig();
    const newItems = items.slice(0);
    newItems.push(item);
    this.helperService.cardSig.set(newItems);

     this.snackBar.open(item.name + ' wurde zum Warenkorb hinzugefügt!', 'Ok', { duration: 1500 });


  }
  doWeHaveEnough(item:iProduct): boolean {
    const availableColors = JSON.parse(item.color);

    for (let i = 0; i < this.colorToBuy.length; i++) {
      if(this.colorToBuy[i].menge > availableColors[i].menge) {
        this.snackBar.open('Es tut uns leid, aber wir haben die gewünschte Menge nicht verfügbar.', 'Ok', {duration: 2000 })
        return false;
      }
    }

    return true;
  }
  close() {
    this.dialogRef.close();
  }
}

