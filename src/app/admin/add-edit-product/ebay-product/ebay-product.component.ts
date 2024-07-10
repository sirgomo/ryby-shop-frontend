import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { EbayInventoryService } from 'src/app/ebay/ebay-inventory/ebay-inventory.service';
import { iProduct } from 'src/app/model/iProduct';

@Component({
  selector: 'app-ebay-product',
  standalone: true,
  imports: [],
  templateUrl: './ebay-product.component.html',
  styleUrl: './ebay-product.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EbayProductComponent implements OnInit {
  @Input('product') product!: iProduct;


  constructor(private readonly invetoryService: EbayInventoryService) {}
  ngOnInit(): void {
    lastValueFrom(this.invetoryService.getInventoryItemGroup(this.product.sku)).then((res) => {
      console.log(res);
    })
  }
}
