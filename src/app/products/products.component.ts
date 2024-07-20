import { ChangeDetectionStrategy, Component, effect, OnInit } from '@angular/core';
import { ProductService } from '../admin/product/product.service';
import { ItemComponent } from './item/item.component';
import { CommonModule } from '@angular/common';
import { ProductsQuanitySelectorComponent } from './products-quanity-selector/products-quanity-selector.component';
import { PaginatorComponent } from '../paginator/paginator.component';
import { ScroolServiceService } from '../helper/scroolService.service';
import { HelperService } from '../helper/helper.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ItemComponent, CommonModule, ProductsQuanitySelectorComponent, PaginatorComponent]
})
export class ProductsComponent implements OnInit {
  
  category: string | null = null; 
  productsSig = this.productService.productsSig;
  constructor( private readonly productService: ProductService, private scroolService: ScroolServiceService, private helper: HelperService,
     private active_route: ActivatedRoute) {
      effect(() => {
        if(this.productService.productsSig().length > 0) {
          if (this.scroolService.getSavedScrollPosition() > 0)
            this.scroolService.scrollTo();
        }
      })
  }

  ngOnInit(): void {
  
    this.active_route.paramMap.subscribe(params => {
      this.category = params.get('category');

      this.helper.appComponenet.kategorieSig()?.forEach((item) => {
        if(item.name === this.category)
          this.helper.appComponenet.changeCategorie(item);
      })
    });
  }


}
