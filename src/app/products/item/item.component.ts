import { Component, Input, Sanitizer } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, concatMap, map, of, shareReplay, tap } from 'rxjs';
import { ProductService } from 'src/app/admin/product/product.service';
import { iProduct } from 'src/app/model/iProduct';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent {
  @Input() item!: iProduct;
  act$ = new Observable();
  image!: SafeResourceUrl;
  constructor( private readonly productService: ProductService, private santizier: DomSanitizer) {}
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
}
