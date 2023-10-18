import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, ViewChildren } from '@angular/core';
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
  fotos: string[] = [];

  constructor (@Inject(MAT_DIALOG_DATA) public readonly data: iProduct,
  private readonly service: ProductService,
  private helperService: HelperService,
  private santizier: DomSanitizer,
  private snackBar: MatSnackBar,
  private dialogRef: MatDialogRef<ItemDetailsComponent>,
  private readonly variationService: VariationsService
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

    this.fotos = [];
    if(this.data.id)
    this.act$ = this.service.getProductById(this.data.id).pipe(map((res) => {
      if(res.id) {
        this.item = res;
     //   this.fotos = JSON.parse(res.foto);

        if(this.fotos.length > 0) {


          this.getImage('image');
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
  getPriceNetto(item: iProduct) {
    return 0// this.item.preis.toString();
  }
  getPriceBrutto(item: iProduct) {
    //const mwst = Number(item.preis) * item.mehrwehrsteuer / 100;
    return 0// (Number(item.preis) + mwst).toFixed(2);
  }
  changeImage(index: number) {
    this.checkChekboxes(index);
    this.getImage(this.fotos[index]);

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

  }

  addItem(item: iProduct) {

    const tmpItem= {} as iProduct;
    Object.assign(tmpItem, item);

    if(!this.doWeHaveEnough(item))
      return;

      this.helperService.cardSigForMengeControl().push(tmpItem);

    const items = this.helperService.cardSig();
    const newItems = items.slice(0);
    newItems.push(item);
    this.helperService.cardSig.set(newItems);

     this.snackBar.open(item.name + ' wurde zum Warenkorb hinzugefügt!', 'Ok', { duration: 1500 });


  }
  doWeHaveEnough(item:iProduct): boolean {




    return true;
  }
  close() {
    this.dialogRef.close();
  }
}

