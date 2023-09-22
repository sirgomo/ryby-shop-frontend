import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { combineLatest, map, tap } from 'rxjs';
import { iLieferant } from 'src/app/model/iLieferant';
import { AddEditLiferantComponent } from '../add-edit-liferant/add-edit-liferant.component';
import { LiferantsService } from './liferants.service';
import { ErrorService } from 'src/app/error/error.service';
import { HelperService } from 'src/app/helper/helper.service';
import { ErrorComponent } from 'src/app/error/error.component';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-liferants',
  templateUrl: './liferants.component.html',
  styleUrls: ['./liferants.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ErrorComponent, MatCardModule, CommonModule, MatTableModule, MatIconModule, MatButtonModule]
})
export class LiferantsComponent implements OnDestroy {
  #title = '';
  lieferanten$ = this.liferantsService.liferants$.pipe(tap((res) => {
    this.#title = this.helper.titelSig();
    this.helper.titelSig.set(this.#title + ' Liferanten')
  }));
  tabColumns: string[] = ['id', 'name', 'email', 'edit', 'delete'];
  constructor(private liferantsService: LiferantsService, private dialog: MatDialog, public error: ErrorService, private helper: HelperService ) { }
  ngOnDestroy(): void {
    this.helper.titelSig.set(this.#title );
  }


  addEditLiferant(lieferant?: iLieferant): void {
    const conf : MatDialogConfig = new MatDialogConfig();
    conf.width = '90%';
    conf.data = lieferant ? lieferant : null;
    this.dialog.open(AddEditLiferantComponent, conf);

  }
  deleteLieferant(id: number) {
    const acct$ = this.liferantsService.deleteLieferant(id);
    this.lieferanten$ = combineLatest([this.liferantsService.liferants$, acct$]).pipe(map(([lifer, del]) => {
      return lifer;
    }))
    }
}
