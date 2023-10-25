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
import { VariationsService } from 'src/app/admin/add-edit-product/variations/variations.service';
import { ProductService } from 'src/app/admin/product/product.service';
import { HelperService } from 'src/app/helper/helper.service';
import { iProduct } from 'src/app/model/iProduct';
import { iProduktVariations } from 'src/app/model/iProduktVariations';
import { doWeHaveEnough } from '../functions';


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

  currentImage!: SafeResourceUrl;
  currentVariation!: iProduktVariations;
  currentItems!: iProduktVariations[];
  constructor (@Inject(MAT_DIALOG_DATA) public readonly data: iProduct,
  private readonly service: ProductService,
  private helperService: HelperService,
  private santizier: DomSanitizer,
  private snackBar: MatSnackBar,
  private dialogRef: MatDialogRef<ItemDetailsComponent>,
  private variationService: VariationsService,
  ) {

    this.titleSig.update((title) => {
      this.title = title;

      return title + ' ' + this.data.name
     })
  }
  ngOnDestroy(): void {
    this.titleSig.set(this.title);
  }
  ngOnInit(): void {

    if(this.data.id)
    this.act$ = this.service.getProductById(this.data.id).pipe(map((res) => {
      if(res.id) {
        this.item = res;


        if(res.variations.length > 0) {
          this.currentVariation = res.variations[0];
          this.getImage(res.variations[0].image);
        }

      }

    }))
  }
  getImage(id: string ) {
    this.act$ = this.variationService.getImage(id).pipe(map((res) => {
      if(res instanceof Blob)
        this.setImage(res);

      return res;
    }))
  }
  setImage(image: Blob) {
    this.currentImage = this.santizier.bypassSecurityTrustResourceUrl(URL.createObjectURL(image));
  }

  getPriceBrutto() {
    const mwst = Number(this.currentVariation.price) * this.item.mehrwehrsteuer / 100;
    return (Number(this.currentVariation.price) + mwst).toFixed(2);
  }
  changeImage(index: number) {

    this.getImage(this.item.variations[index].image);
    this.currentVariation = this.item.variations[index];

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


  addItem(item: iProduct) {

    const tmpItem= {} as iProduct;
    const tmpVari: iProduktVariations = {} as iProduktVariations;
    Object.assign(tmpItem, item);
    Object.assign(tmpVari, this.currentVariation);
    tmpVari.quanity = 1;
    if(!doWeHaveEnough(item, this.helperService, this.currentVariation))
     {
      this.snackBar.open(' Es tut uns leider, es sind nur '+this.currentVariation.quanity+' verfügbar', 'Ok', { duration: 1500 });
      return;
     }
        tmpItem.variations = [tmpVari];
          this.helperService.cardSigForMengeControl().push(tmpItem);

        const items = this.helperService.cardSig();
        const newItems = items.slice(0);
        newItems.push(tmpItem);
        this.helperService.cardSig.set(newItems);

        this.snackBar.open(item.name + ' wurde zum Warenkorb hinzugefügt!', 'Ok', { duration: 1500 });
  }

  close() {
    this.dialogRef.close();
  }
}
