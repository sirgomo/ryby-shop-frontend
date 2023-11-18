import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProductService } from '../admin/product/product.service';
import { ItemComponent } from './item/item.component';
import { CommonModule } from '@angular/common';
import { ProductsQuanitySelectorComponent } from './products-quanity-selector/products-quanity-selector.component';



@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ItemComponent, CommonModule, ProductsQuanitySelectorComponent]
})
export class ProductsComponent {
  productsSig = this.productService.productsSig;


  constructor( private readonly productService: ProductService ) {}


}
