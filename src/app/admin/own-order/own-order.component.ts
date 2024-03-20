import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
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

@Component({
  selector: 'app-own-order',
  standalone: true,
  imports: [ErrorComponent, CommonModule, ProductsQuanitySelectorComponent, MatTableModule, PaginatorComponent, MatButtonModule, MatDialogModule, SellItemComponent],
  templateUrl: './own-order.component.html',
  styleUrl: './own-order.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnOrderComponent implements OnInit {
  #user: iUserData = {} as iUserData;
  #newOrder: iBestellung = {} as iBestellung;
  products: iProduct[] = [];
  itemsCountSig = signal(0);
  productsSig = this.prodService.productsSig;
  displayedColumns: string[] = ['prodid','artid', 'name', 'verfugbar', 'add_item'];
    constructor(private readonly userService: UserService, private readonly orderService: OrdersService, private readonly prodService: ProductService,
       public errService: ErrorService, private readonly dialog: MatDialog) {}
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
                console.log(this.products);
              }
            })
          }
        );
    else
        this.errService.newMessage('Es gibt kein Porduct id!');
  }
  saveOrder(){
    if( Object(this.#user).role === 'ADMIN') {
      this.#newOrder.kunde = this.#user;
    }
  }
}
