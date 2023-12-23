import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WareneingangService } from './wareneingang.service';
import { iWarenEingang } from 'src/app/model/iWarenEingang';
import { ErrorService } from 'src/app/error/error.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddEditBuchungComponent } from './add-edit-buchung/add-edit-buchung.component';
import { Observable } from 'rxjs';
import { ErrorComponent } from 'src/app/error/error.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-wareneingang',
  templateUrl: './wareneingang.component.html',
  styleUrls: ['./wareneingang.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ErrorComponent, CommonModule, MatTableModule, MatIconModule, MatButtonModule],

})
export class WareneingangComponent {
    weingangSig = this.wEingangService.warenEingangSig;
    act$ = new Observable();
    displayedColumns: string[] = ['id', 'liferant', 'rechnung', 'lieferscheinNr', 'empfangsdatum', 'datenEingabe', 'gebucht', 'bearbeiten', 'delete'];
    constructor( private readonly wEingangService: WareneingangService, public errService: ErrorService, private dialog: MatDialog) {}
    newOrEditGoodsReceipt(item? : iWarenEingang) {
      const conf : MatDialogConfig = new MatDialogConfig();
      conf.width = '95vw';
      conf.minWidth= '95vw';
      conf.height = '100%';

      if(item)
        conf.data = item;

        this.dialog.open(AddEditBuchungComponent, conf);
    }
    deleteGoodsReceipt(itemid: number) {
     this.act$ = this.wEingangService.deleteWareneingangBuchung(itemid);
    }

}
