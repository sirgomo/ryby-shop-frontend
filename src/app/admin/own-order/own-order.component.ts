import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ErrorComponent } from 'src/app/error/error.component';
import { iBestellung } from 'src/app/model/iBestellung';
import { iUserData } from 'src/app/model/iUserData';
import { OrdersService } from 'src/app/orders/orders.service';
import { ProductsQuanitySelectorComponent } from 'src/app/products/products-quanity-selector/products-quanity-selector.component';
import { UserService } from 'src/app/user/user.service';
import { ProductService } from '../product/product.service';
import { MatTableModule } from '@angular/material/table';
import { ErrorService } from 'src/app/error/error.service';
import { iProduct } from 'src/app/model/iProduct';
import { PaginatorComponent } from 'src/app/paginator/paginator.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { SellItemComponent } from './sell-item/sell-item.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ShowItemsComponent } from './show-items/show-items.component';
import { iProductBestellung } from 'src/app/model/iProductBestellung';
import { IShippingCost } from 'src/app/model/iShippingCost';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DestructionProtocolComponent } from '../destruction-protocol/destruction-protocol.component';

@Component({
  selector: 'app-own-order',
  standalone: true,
  imports: [ErrorComponent, CommonModule, ProductsQuanitySelectorComponent, MatTableModule, PaginatorComponent, MatButtonModule, MatDialogModule, SellItemComponent,
   MatTabsModule, ShowItemsComponent, DestructionProtocolComponent],
  templateUrl: './own-order.component.html',
  styleUrl: './own-order.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnOrderComponent implements OnInit {
  @ViewChild(ShowItemsComponent) showitem!: ShowItemsComponent;
  #user: iUserData = {} as iUserData;
  #newOrder: iBestellung = {} as iBestellung;
  products: iProduct[] = [];
  itemsCountSig = signal(0);
  productsSig = this.prodService.productsSig;
  displayedColumns: string[] = ['prodid','artid', 'name', 'verfugbar', 'add_item'];
    constructor(private readonly userService: UserService, private readonly orderService: OrdersService, private readonly prodService: ProductService,
       public errService: ErrorService,private readonly dialog: MatDialog, private readonly snack: MatSnackBar) {}
  ngOnInit(): void {
   firstValueFrom(this.userService.getUserDetails()).then((res) => {
    this.#user = res;
    });
  }
  addItemToOrder(prod: iProduct){
    if(prod.id)
      firstValueFrom(this.prodService.getProduktWithBuyPrice(prod.id)).then((res) => {
        const conf: MatDialogConfig = new MatDialogConfig();
        conf.width = '100%';
        conf.height = '100%';
        conf.data = res;

            this.dialog.open(SellItemComponent, conf).afterClosed().subscribe((prod) => {
              if(prod && prod.length > 0) {
                this.products = [...this.products, ...prod];
                this.itemsCountSig.set(this.products.length);
              }
            })
          }
        );
    else
        this.errService.newMessage('Es gibt kein Porduct id!');
  }
  saveOrder(){
    if(this.products.length === 0)
      return;

    if( Object(this.#user).role === 'ADMIN') {
      this.#newOrder.kunde = this.#user;
      const products: iProductBestellung[] = [];
      for (let i = 0; i < this.products.length; i++) {
        const item = {} as iProductBestellung;
        item.produkt = [this.products[i]];
        products.push(item);
      }
      this.#newOrder.produkte = products;

      const shhip : IShippingCost = {shipping_name: 'selbstabholer', shipping_price: 0, average_material_price: 0, cost_per_added_stuck: 0};
      this.#newOrder.versandprice = 0;
      this.#newOrder.versandart = shhip.shipping_name;
      firstValueFrom(this.orderService.createOwnOrder(this.#newOrder)).then((res) => {
        console.log(res);
        if(Object(res).status === 200 ) {
          this.snack.open('Bestellung wurde gespeichert!', 'OK', { duration: 1500 })
          this.showitem.clearItems();
        }

      });
    }

  }
  removeProduct(index: number) {
    if(index === -2)
      this.products = [];

    if(index !== -1) {
      this.products.splice(index, 1);
      this.snack.open('Produkt wurde gelöscht', 'OK', { duration: 1500 })
    }


    if(index === -1)
      this.saveOrder();

  }
}
