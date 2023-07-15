import { Component } from '@angular/core';
import { ProductService } from './product.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { iProduct } from 'src/app/model/iProduct';
import { AddEditProductComponent } from '../add-edit-product/add-edit-product.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  displayedColumns: string[] = ['prodid', 'name', 'preis', 'verfugbar', 'edit', 'delete'];
  productsSig = this.prodService.productsSig;
  constructor( private readonly prodService: ProductService, private readonly dialog: MatDialog) {}

  addEditProduct(item?: iProduct) {
    const conf : MatDialogConfig = new MatDialogConfig();
    conf.width = '90%';
    conf.height = '100%'

    conf.data = item ? item: null;
    this.dialog.open(AddEditProductComponent, conf);
  }
}
