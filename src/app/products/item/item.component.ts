import { Component, Input, Sanitizer } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, concatMap, map, of, shareReplay, tap } from 'rxjs';
import { ProductService } from 'src/app/admin/product/product.service';
import { iProduct } from 'src/app/model/iProduct';
import { ItemDetailsComponent } from '../item-details/item-details.component';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent {
  @Input() item!: iProduct;
  act$ = new Observable();
  image!: SafeResourceUrl;
  constructor( private readonly productService: ProductService, private santizier: DomSanitizer,
    private readonly dialog: MatDialog) {}
  getImage(item: iProduct)  {
    const images = JSON.parse(item.foto);

    if(images.length > 0 && !this.image) {
       this.act$ =  this.productService.getThumbnails(images[0]).pipe(map(res => {
        if (res instanceof Blob) {
          this.image = this.santizier.bypassSecurityTrustResourceUrl(URL.createObjectURL(res));
        }
        return of(undefined);
      }))
    }
    return this.image;
  }
  openDetails() {
  const conf : MatDialogConfig = new MatDialogConfig();
  conf.width = '90%';
  conf.height= '90%';
  conf.data = this.item;
    this.dialog.open(ItemDetailsComponent, conf);
 }
}
