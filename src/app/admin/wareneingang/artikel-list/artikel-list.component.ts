import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { WareneingangService } from '../wareneingang.service';
import { combineLatest, map, of, switchMap, tap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { iProduct } from 'src/app/model/iProduct';
import { iWarenEingang } from 'src/app/model/iWarenEingang';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddEditProductToBuchungComponent } from '../add-edit-product-to-buchung/add-edit-product-to-buchung.component';
import { iWareneingangProduct } from 'src/app/model/iWareneingangProduct';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-artikel-list',
  templateUrl: './artikel-list.component.html',
  styleUrls: ['./artikel-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule]
})
export class ArtikelListComponent {

  items: iProduct[] = [];
  displayedColumns: string[] = ['sku','artid', 'name', 'add'];

  products$ = combineLatest([of(this.items), toObservable(this.wEingService.lieferantIdSig)]).pipe(
    switchMap(([items, lifid]) => this.wEingService.getProduktsForWarenEingang(lifid)),
    map((res) => {
      return res;
    })
  )
  constructor(private wEingService: WareneingangService, private dialog: MatDialog) {}

  addProduct(product: iProduct) {

    const item: iWareneingangProduct = {
      wareneingang: null,
      produkt: [product],
      product_variation: []
    };
    const conf: MatDialogConfig = new MatDialogConfig();
      conf.width = '95vw';
      conf.minWidth = '95vw';
      conf.height = '100%';
      conf.data = item;

      this.dialog.open(AddEditProductToBuchungComponent, conf);
    }
}
