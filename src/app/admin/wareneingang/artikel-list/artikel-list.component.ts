import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { WareneingangService } from '../wareneingang.service';
import { combineLatest, map, of, switchMap, tap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { iProduct } from 'src/app/model/iProduct';

@Component({
  selector: 'app-artikel-list',
  templateUrl: './artikel-list.component.html',
  styleUrls: ['./artikel-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtikelListComponent implements OnInit{
  items: iProduct[] = [];

  products$ = combineLatest([of(this.items), toObservable(this.wEingService.lieferantIdSig)]).pipe(
    switchMap(([items, lifid]) => this.wEingService.getProduktsForWarenEingang(lifid)),
    map((res) => {
      return res;
    })
  )
  constructor(private wEingService: WareneingangService) {}
  ngOnInit(): void {

  }
}
