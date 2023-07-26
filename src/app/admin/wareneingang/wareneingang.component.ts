import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WareneingangService } from './wareneingang.service';
import { iWarenEingang } from 'src/app/model/iWarenEingang';
import { ErrorService } from 'src/app/error/error.service';

@Component({
  selector: 'app-wareneingang',
  templateUrl: './wareneingang.component.html',
  styleUrls: ['./wareneingang.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WareneingangComponent {
    weingangSig = this.wEingangService.warenEingangSig;
    displayedColumns: string[] = ['id', 'liferant', 'rechnung', 'lieferscheinNr', 'empfangsdatum', 'datenEingabe', 'gebucht', 'bearbeiten', 'delete'];
    constructor( private readonly wEingangService: WareneingangService, public errService: ErrorService) {}
    newOrEditGoodsReceipt(item? : iWarenEingang) {}
    deleteGoodsReceipt() {}

}
