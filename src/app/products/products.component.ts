import { AfterContentChecked, ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { ProductService } from '../admin/product/product.service';
import { ItemComponent } from './item/item.component';
import { CommonModule } from '@angular/common';
import { ProductsQuanitySelectorComponent } from './products-quanity-selector/products-quanity-selector.component';
import { PaginatorComponent } from '../paginator/paginator.component';
import { HelperService } from '../helper/helper.service';
import { iKategorie } from '../model/iKategorie';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ItemComponent, CommonModule, ProductsQuanitySelectorComponent, PaginatorComponent]
})
export class ProductsComponent implements OnInit, OnDestroy {

  sub = new Subscription();
  productsSig = this.productService.productsSig;
  constructor( private readonly productService: ProductService, private readonly helper: HelperService, private acRoute: ActivatedRoute ) {}
  ngOnDestroy(): void {
   this.sub.unsubscribe();
  }
  ngOnInit(): void {
    this.sub = this.acRoute.params.subscribe((rout: Params) => {
            this.helper.kategorySig.set({ id: -1, name: rout['category']} as iKategorie);
    })


  }



}
