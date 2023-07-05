import { ChangeDetectionStrategy, Component } from '@angular/core';
import { KategorieService } from './kategorie.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddEditKategorieComponent } from '../add-edit-kategorie/add-edit-kategorie.component';
import { ErrorService } from 'src/app/error/error.service';
import { iKategorie } from 'src/app/model/iKategorie';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-kategories',
  templateUrl: './kategories.component.html',
  styleUrls: ['./kategories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KategoriesComponent {
  kategorie$ = this.catService.kategorie$;
    constructor (private readonly catService: KategorieService, private readonly dialog: MatDialog, public errrorSer: ErrorService ) {}
  displayedColumns: string[] = ['kategoriaid', 'kategorian', 'iloscitemow', 'edit', 'delete'];

  deleteKategoria(id: number): void {
    this.kategorie$ = this.catService.deleteCategory(id);
  }

  editKategoria(item: iKategorie): void {
    const conf: MatDialogConfig = new MatDialogConfig();
    conf.data = item;
    this.dialog.open(AddEditKategorieComponent, conf);
  }

  addKategorie(): void {
    const conf: MatDialogConfig = new MatDialogConfig();
    this.dialog.open(AddEditKategorieComponent, conf);
  }
}
