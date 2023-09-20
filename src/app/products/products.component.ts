import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProductService } from '../admin/product/product.service';
import { ItemComponent } from './item/item.component';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ItemComponent]
})
export class ProductsComponent {
  productsSig = this.productService.productsSig;


  constructor( private readonly productService: ProductService ) {}


}
