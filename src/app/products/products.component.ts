import { Component } from '@angular/core';
import { ProductService } from '../admin/product/product.service';
import { Observable, map, tap } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { iProduct } from '../model/iProduct';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  products = this.productService.productsSig;
  act$ = new Observable();
  constructor( private readonly productService: ProductService,
    private readonly santizier: DomSanitizer,
    ) {}

  getImage(item: iProduct) {
    const images = JSON.parse(item.foto);
    let image = new Blob();
    this.act$ = this.productService.getImage(images[0]).pipe(tap(res => {
      console.log(res)
        image = res;
    }))

    return this.santizier.bypassSecurityTrustResourceUrl(URL.createObjectURL(image));
  }
}
