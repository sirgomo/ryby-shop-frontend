import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { WareneingangService } from '../wareneingang.service';
import { iWareneingangProduct } from 'src/app/model/iWareneingangProduct';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddEditProductToBuchungComponent } from '../add-edit-product-to-buchung/add-edit-product-to-buchung.component';
import { Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-artikel-gebucht',
  templateUrl: './artikel-gebucht.component.html',
  styleUrls: ['./artikel-gebucht.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule]
})
export class ArtikelGebuchtComponent {
  columns = ['id', 'pname', 'menge', 'mwst', 'edit', 'del' ];
  act$ = new Observable();
  productsSig = computed(() => {
   const current = this.wEingService.currentProductsInBuchungSig();

   return current;
  });
  constructor(private readonly wEingService: WareneingangService, private dialog: MatDialog) {}
  editProduct(product: iWareneingangProduct) {

    const conf: MatDialogConfig = new MatDialogConfig();
    conf.width = '80%';
    conf.height = '80%';
    conf.data = product;

    this.dialog.open(AddEditProductToBuchungComponent, conf);
  }
  deleteProductFromBuchung(product: iWareneingangProduct) {
    const wareneingangId = this.wEingService.currentWarenEingangSig()?.data.id;
    if( wareneingangId !== undefined && product.id) {
      this.act$ = this.wEingService.deleteProductFromWarenEingang(wareneingangId, product.id).pipe(tap(res => {
        if(res.affected === 1) {
          const items = this.wEingService.currentProductsInBuchungSig();
          const index = items.findIndex((tmp) => tmp.id === product.id);
          items.splice(index, 1);
          const newItems = items.slice(0);
          this.wEingService.currentProductsInBuchungSig.set(newItems);
        }
    }))
    }

    }

}
