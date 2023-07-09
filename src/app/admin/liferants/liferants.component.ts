import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, combineLatest, map } from 'rxjs';
import { iLieferant } from 'src/app/model/iLieferant';
import { AddEditLiferantComponent } from '../add-edit-liferant/add-edit-liferant.component';
import { LiferantsService } from './liferants.service';

@Component({
  selector: 'app-liferants',
  templateUrl: './liferants.component.html',
  styleUrls: ['./liferants.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiferantsComponent {

  lieferanten$ = this.liferantsService.liferants$;
  tabColumns: string[] = ['id', 'name', 'email', 'edit', 'delete'];
  constructor(private liferantsService: LiferantsService, private dialog: MatDialog) { }


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
