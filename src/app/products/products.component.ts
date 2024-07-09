import { ChangeDetectionStrategy, Component, effect } from '@angular/core';
import { ProductService } from '../admin/product/product.service';
import { ItemComponent } from './item/item.component';
import { CommonModule } from '@angular/common';
import { ProductsQuanitySelectorComponent } from './products-quanity-selector/products-quanity-selector.component';
import { PaginatorComponent } from '../paginator/paginator.component';
import { Subscription } from 'rxjs';
import { ScroolServiceService } from '../helper/scroolService.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ItemComponent, CommonModule, ProductsQuanitySelectorComponent, PaginatorComponent]
})
export class ProductsComponent {

  sub = new Subscription();
  productsSig = this.productService.productsSig;
  constructor( private readonly productService: ProductService, private scroolService: ScroolServiceService) {
      effect(() => {
        if(this.productService.productsSig().length > 0) {
          if (this.scroolService.getSavedScrollPosition() > 0)
            this.scroolService.scrollTo();
        }
      })
  }




}
