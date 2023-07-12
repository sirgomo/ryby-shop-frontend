import { AfterContentChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { KategorieService } from './kategorie.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddEditKategorieComponent } from '../add-edit-kategorie/add-edit-kategorie.component';
import { ErrorService } from 'src/app/error/error.service';
import { iKategorie } from 'src/app/model/iKategorie';
import { combineLatest, map, tap } from 'rxjs';
import { HelperService } from 'src/app/helper/helper.service';

@Component({
  selector: 'app-kategories',
  templateUrl: './kategories.component.html',
  styleUrls: ['./kategories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KategoriesComponent implements OnDestroy {
  #title = '';
  kategorie$ = this.catService.kategorie$.pipe((tap(res => {
    this.#title = this.helper.titelSig();
    this.helper.titelSig.set(this.#title + ' Kategorie')
  })));
    constructor (private readonly catService: KategorieService, private readonly dialog: MatDialog, public errrorSer: ErrorService, private helper: HelperService
      ) {}

  ngOnDestroy(): void {
    this.helper.titelSig.set(this.#title);
  }
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
