import { Component } from '@angular/core';
import { ProductService } from '../admin/product/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  products = this.productService.productsSig;
  constructor( private readonly productService: ProductService) {}
}
