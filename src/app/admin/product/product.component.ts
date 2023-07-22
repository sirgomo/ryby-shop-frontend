import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProductService } from './product.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { iProduct } from 'src/app/model/iProduct';
import { AddEditProductComponent } from '../add-edit-product/add-edit-product.component';
import { Observable } from 'rxjs';
import { HelperService } from 'src/app/helper/helper.service';
import { iKategorie } from 'src/app/model/iKategorie';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductComponent {
  displayedColumns: string[] = ['prodid', 'name', 'preis', 'verfugbar', 'edit', 'delete'];
  productsSig = this.prodService.productsSig;
  del$ = new Observable();
  constructor( private readonly prodService: ProductService, private readonly dialog: MatDialog, private helperService: HelperService) {
    this.helperService.kategorySig.set({id: 0} as iKategorie);
  }

  addEditProduct(item?: iProduct) {
    const conf : MatDialogConfig = new MatDialogConfig();
    conf.width = '90%';
    conf.height = '100%'

    conf.data = item ? item: null;
    this.dialog.open(AddEditProductComponent, conf);
  }
  deleteProdukt(prod: iProduct) {
   const yes = window.confirm('Bist du sicher das du der Produkt '+ prod.name +' löschen willst ?');
   if (yes && prod.id) {
    this.del$ = this.prodService.deleteProduct(prod.id);
   }
  }
}
