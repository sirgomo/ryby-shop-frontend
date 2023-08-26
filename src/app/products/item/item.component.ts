import { ChangeDetectionStrategy, Component, Input, OnInit, Sanitizer } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, concatMap, map, of, shareReplay, tap } from 'rxjs';
import { ProductService } from 'src/app/admin/product/product.service';
import { iProduct } from 'src/app/model/iProduct';
import { ItemDetailsComponent } from '../item-details/item-details.component';
import { iColor } from 'src/app/model/iColor';
import { HelperService } from 'src/app/helper/helper.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush,
})
export class ItemComponent implements OnInit {
  @Input() item!: iProduct;
  act$ = new Observable();
  image!: SafeResourceUrl | undefined;
  color: iColor[] = [];
  images: string[] = [];
  selectedColor: iColor = {} as iColor;
  constructor( private readonly productService: ProductService, private santizier: DomSanitizer,
    private readonly dialog: MatDialog,
    private helper: HelperService,
    private snackBar: MatSnackBar) {


    }
  ngOnInit(): void {
    if(this.item) {
      let tmpColor : iColor[] = JSON.parse(this.item.color);
      let tmpClolor1 = tmpColor.filter((item) => item.menge > 0)
      this.images = JSON.parse(this.item.foto);
      this.color = tmpClolor1;
      const index = tmpColor.findIndex((item) => item.id === tmpClolor1[0].id);
      this.getImage(this.images[index])
      this.selectedColor = this.color[0];

    }


  }

  getImage(item: string)  {
    this.image = undefined;
       this.act$ =  this.productService.getThumbnails(item).pipe(map(res => {
        if (res instanceof Blob) {
          this.image = this.santizier.bypassSecurityTrustResourceUrl(URL.createObjectURL(res));
        }
        return of(undefined);
      }))

    return this.image;
  }
  openDetails() {
  const conf : MatDialogConfig = new MatDialogConfig();
  conf.width = '90%';
  conf.height= '90%';
  conf.data = this.item;
    this.dialog.open(ItemDetailsComponent, conf);
 }
 colorChange(val: any) {
  const index = this.color.findIndex((item) => item.id === val.value);
  this.getImage(this.images[index]);
  this.selectedColor = this.color[index];


 }
 getPriceBrutto(item: iProduct) {
  const mwst = Number(item.preis) * item.mehrwehrsteuer / 100;
  return (Number(item.preis) + mwst).toFixed(2);
  }
  addItem(item: iProduct) {

    this.selectedColor.menge = 1;
    let tmpItem: iProduct = {} as iProduct;
    Object.assign(tmpItem, item);
    tmpItem.color = JSON.stringify([this.selectedColor]);

    const items = this.helper.cardSig();
    const newItems = items.slice(0);
    newItems.push(tmpItem);
    this.helper.cardSig.set(newItems);
    this.snackBar.open(item.name + ' wurde zum Warenkorb hinzugefügt!', 'Ok', { duration: 1500 });

  }
}
